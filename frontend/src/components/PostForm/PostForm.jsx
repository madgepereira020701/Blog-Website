import React, { useState } from 'react';

const postvalues = {title: '', content:''};

const PostForm = () => {
 const [error, setError] = useState('');
 const [warnings, setWarnings] = useState({});
 const [post, setPost] = useState(postvalues);

 const validateFields = (field,value) => {
    const newWarnings = {...warnings};
  if(field === 'title' && value.trim() === '') {
    newWarnings.title = 'Title Required';
  } else   if(field === 'content' && value.trim() === '') {
    newWarnings.content = 'Content Required';
  } else { delete newWarnings[field];}
  setWarnings(newWarnings);
 }

 const onInputChange = (e) => {
    setPost({...post, [e.target.name]: e.target.value});
    validateFields(e.target.name, e.target.value);
 }

 const postform = async() => {
  if(!post.title || !post.content) {
    setError('Fill in the fields');
    return;
  }

    if(Object.keys(warnings).length > 0 ) {
    setError('Resolve all warnings');
    return;
  }

  const token = localStorage.getItem('token');
  if(!token) {
    console.error('token not found');
  }
try {
  const response = await fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

      const data = await response.json();
    if(!response.ok) {
      throw new Error(data.message || 'Failed to add posts');
    }
    alert('');
    setPost(postvalues);
    setError('');
  }

  catch (err) {
    console.error(err.message);
    setError(error.message);
  }

 }
 return (
    <div className='form-container'>
        <h2>Post</h2>
        {error && <div className='error'>{error}</div>}<br/>                
        <input type='text' name='title' className='input-field' placeholder='Title' onChange={onInputChange}/><br/><br/>
        {warnings.title && <div className='warnings'>{warnings.title}</div>}<br/>                
        <textarea type='text' name='content' className='input-field' placeholder='Content' onChange={onInputChange}/><br/><br/>
        {warnings.content && <div className='warnings'>{warnings.content}</div>}<br/>  
        <button onClick={postform}>Post</button>              
    </div>
 );
}

export default PostForm;