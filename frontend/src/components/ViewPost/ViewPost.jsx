import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import { useParams, useLocation } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import './ViewPost.css';

const ViewPost = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', content: '', image: null });
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [postId, setPostId] = useState(null);
  const { title } = useParams();
    const { _id } = useParams();


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
          _id: data.data._id,
          title: data.data.title,
          content: data.data.content,
          image: data.data.image || null,
        });
          setPostId(data.data._id); // store the id here
          setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
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

  const location = useLocation();

useEffect(() => {
  if (location.state && location.state.editMode) {
    setIsEditing(true);
  }
}, [location.state]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (value) => {
    setEditData((prev) => ({ ...prev, content: value }));
  };

const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const base64 = await convertToBase64(file);
    setEditData((prev) => ({ ...prev, image: base64 }));
  }
};

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Image conversion failed'));
    });

      const formatDate= (isoDateStr) => {
    const date = new Date(isoDateStr);
  
    const datePart = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  
    const timePart = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return (
      <>
        {datePart} <span style={{ margin: '0 10px' }}></span> {timePart}
      </>
    );
  };
    

const updatePost = async () => {
  const token = localStorage.getItem('token');
  if (!token || !postId) return;

  try {
    const base64Image = editData.image;

    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
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
      {isEditing && loading && <p>Loading post data...</p>}
      {error && <p className="error-message">{error}</p>}

      {!isEditing && post && (
        <div className="post-details">
          <div className="post-header">
  <h3>{post.title}</h3>
  <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
  </div>
          {post.image && <img src={post.image} alt="Post" className="post-img" />}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
                <p>Last Modified: {formatDate(post.lastModifiedDate)} <span className='createdat'>Created: {formatDate(post.createdAt)}</span></p>


        </div>
      )}

      {isEditing && !loading && (
        <div className="edit-post-form">
                      <input
                type="text"
                name="title"
                className="input-field"
                placeholder="Title"
                onChange={handleInputChange}
                value={editData.title}
            /><br /><br />

          <input type="file" accept="image/*" onChange={handleImageChange} />
          {editData.image && !(editData.image instanceof File) && (
            <img src={editData.image} alt="Preview" className="post-img" />
          )} 
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