// ✅ Suppress ALL runtime errors & deprecation warnings
window.onerror = (message, source, lineno, colno, error) => {
    if (message.includes('DOMNodeInserted')) {
        return true;  // Suppress the warning
    }
    return false;  // Display other errors
};

window.addEventListener('error', (event) => {
    if (event.message.includes('DOMNodeInserted')) {
        event.preventDefault();
    }
}, true);


import React, { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const PostForm = () => {
    const [error, setError] = useState('');
    const [warnings, setWarnings] = useState({});
    const [post, setPost] = useState({ title: '', content: '', image: null });

    const quillRef = useRef(null);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            console.log('DOM mutation detected');
        });

        if (quillRef.current) {
            const editor = quillRef.current.getEditor().root;
            observer.observe(editor, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, []);

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
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

    const postform = () => {
        console.log('Post submitted:', post);
    };

    return (
        <div className='form-container'>
            <h2>Post</h2>
            
            {error && <div className='error'>{error}</div>}<br />

            <input
                type='text'
                name='title'
                className='input-field'
                placeholder='Title'
                onChange={onInputChange}
                value={post.title}
            /><br /><br />

            <ReactQuill
                ref={quillRef}
                value={post.content}
                onChange={handleQuillChange}
                modules={modules}
                placeholder="Write something amazing..."
            /><br /><br />

            <button onClick={postform}>Post</button>
        </div>
    );
};

export default PostForm;
