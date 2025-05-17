import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ViewPost.css';

const ViewPost = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', content: '', image: null });
  const quillRef = useRef(null);
  const { title } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:3000/post/${title}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch post details');

        const data = await response.json();
        setPost(data.data);
        setEditData({
          title: data.data.title,
          content: data.data.content,
          image: data.data.image || null,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    if (title) fetchPost();
  }, [title]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (value) => {
    setEditData((prev) => ({ ...prev, content: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setEditData((prev) => ({ ...prev, image: file }));
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Image conversion failed'));
    });

  const updatePost = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const base64Image = editData.image instanceof File
        ? await convertToBase64(editData.image)
        : editData.image;

      const response = await fetch(`http://localhost:3000/posts/${title}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editData.title,
          content: editData.content,
          image: base64Image,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Update failed');

      setPost(result.data);
      setPost({
  ...post,
  title: editData.title,
  content: editData.content,
  image: editData.image instanceof File
    ? await convertToBase64(editData.image)
    : editData.image,
});
setIsEditing(false);

      setIsEditing(false);
      alert('Post updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      setError('Error updating the post.');
    }
  };

  return (
    <div className="table-container">
      <h2>Post Details</h2>
      {error && <p className="error-message">{error}</p>}

      {!isEditing && post && (
        <div className="post-details">
          <h3>{post.title}</h3>
          {post.image && <img src={post.image} alt="Post" className="post-img" />}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}

      {isEditing && (
        <div className="edit-post-form">
          {/* <input type="file" accept="image/*" onChange={handleImageChange} />
          {editData.image && !(editData.image instanceof File) && (
            <img src={editData.image} alt="Preview" className="post-img" />
          )} */}
          <ReactQuill
            ref={quillRef}
            value={editData.content}
            onChange={handleQuillChange}
            modules={modules}
          />
          <div className="button-group">
            <button onClick={updatePost}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPost;
