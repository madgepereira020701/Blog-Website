import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({
    content: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Fetched posts data:', data);

        if (response.ok) {
          setPosts(Array.isArray(data.data) ? data.data : []);
        } else {
          throw new Error(data.message || 'Failed to fetch posts');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setUpdatedDetails({
      content: post.content || '',
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });
  };

  const handleUpdatePost = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/posts/${updatedDetails.title}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDetails),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update post');
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.title === updatedDetails.title ? { ...post, ...updatedDetails } : post
        )
      );

      setEditingPost(null);
      setError(null);
      alert('Post updated successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setUpdatedDetails({
      content: '',
    });
  };

  const handleDeletePost = async (title) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/posts/${title}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }

      setPosts(posts.filter((post) => post.title !== title));
      alert('Post deleted successfully!');
    } catch (error) {
      setError(error.message);
    }
  };
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
    
  
  const handleView = (title) => {
    navigate(`/post/${title}`);
  };

  return (
    <div className="table-posts-container">
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <h2>Posts List</h2>
          <div className="post-table-wrapper">
  {posts.map((post) => (
    <div key={post._id} className="post-card">
      {post.image && <img src={post.image} alt="Post" width="250" />}
      <div className='wrapper'>
            <p>{post.title}</p>
          <div className='truncate-multiline'dangerouslySetInnerHTML={{ __html: post.content }} />
      <p>{formatDate(post.createdAt)}</p>
      <div className="actions">
        <button className="membutton" onClick={() => handleView(post.title)}>View</button>
        <button className="membutton" onClick={() => handleEdit(post)}>Edit</button>
        <button className="membutton" onClick={() => handleDeletePost(post.title)}>Delete</button>
      </div>
    </div>  
    </div>
  ))}
</div>


          {editingPost && (
            <div className="edit-form-posts">
              <h3>Edit Post</h3>
              <label>Content:</label>
              <input
                type="text"
                name="content"
                className="input-field"
                value={updatedDetails.content}
                onChange={handleUpdateChange}
              />

              {error && <p className="error-message">{error}</p>}

              <div className="button-group">
                <button onClick={handleUpdatePost} className="add">
                  Update
                </button>
                <button onClick={handleCancelEdit} className="cancel">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Posts;
