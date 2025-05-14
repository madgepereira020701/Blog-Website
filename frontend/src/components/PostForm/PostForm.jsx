import React, { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import './PostForm.css';

const addpostInitialValues = { title: '', content: '', image: null };

const PostForm = () => {
    const [error, setError] = useState('');
    const [post, setPost] = useState(addpostInitialValues);
    const [uploadedPost, setUploadedPost] = useState(null);
    const quillRef = useRef(null);

    useEffect(() => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor().root;
            const observer = new MutationObserver(() => {});
            observer.observe(editor, { childList: true, subtree: true });
            return () => observer.disconnect();
        }
    }, []);

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean']
        ]
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value
        }));
    };

    const handleQuillChange = (value) => {
        setPost((prevPost) => ({
            ...prevPost,
            content: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPost((prevPost) => ({
                ...prevPost,
                image: file
            }));
        }
    };

    const postform = async () => {
        if (!post.title || !post.content) {
            setError('Fill in all the fields');
            return;
        }
    
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            return;
        }
    
        try {
            let base64Image = null;
    
            // Convert image to base64 using a Promise
            const convertToBase64 = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error("Image conversion failed"));
                });
            };
    
            if (post.image) {
                base64Image = await convertToBase64(post.image);
            }
    
            const formData = {
                title: post.title,
                content: post.content,
                image: base64Image, // base64 string or null
            };
    
            const response = await fetch('http://localhost:3000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });
    
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add post');
            }
    
            setPost(addpostInitialValues);
            setError('');
            setUploadedPost(data.post);
            alert('Post added successfully!');
        } catch (error) {
            console.error('Error submitting post:', error);
            setError('There was an error submitting the form. Please try again.');
            alert('Error submitting the post. Please try again.');
        }
    };
    
    
    

    return (
        <div className="form-container">
            <h2>Create Post</h2>
            {error && <div className="error">{error}</div>}<br />

            <input
                type="text"
                name="title"
                className="input-field"
                placeholder="Title"
                onChange={onInputChange}
                value={post.title}
            /><br /><br />

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            /><br /><br />

            {post.image && (
                <img
                    src={URL.createObjectURL(post.image)}
                    alt="Selected"
                    style={{ width: '300px', marginTop: '10px', borderRadius: '8px' }}
                />
            )}<br /><br />

            <ReactQuill
                ref={quillRef}
                value={post.content}
                onChange={handleQuillChange}
                modules={modules}
                placeholder="Write something amazing..."
            /><br /><br />

            <button onClick={postform}>Post</button>

            {uploadedPost && (
                <div className="uploaded-post-preview" style={{ marginTop: '30px', border: '1px solid #ccc', padding: '20px' }}>
                    <h3>Uploaded Post Preview:</h3>
                    <h4>{uploadedPost.title}</h4>
                    <div dangerouslySetInnerHTML={{ __html: uploadedPost.content }} />
                    {uploadedPost.image && (
                        <img
                            src={uploadedPost.image}
                            alt="Uploaded"
                            style={{ width: '300px', marginTop: '10px', borderRadius: '8px' }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default PostForm;
