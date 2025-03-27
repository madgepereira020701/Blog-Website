import React, { useState } from 'react';
//import { createPost } from '../services/postService'; // Assuming you have a postService

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      //const newPost = await createPost({ title, content });
      setTitle('');
      setContent('');
      if (onPostCreated) {
        //onPostCreated(newPost.post); // Notify parent component of new post
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create post.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;