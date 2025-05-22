// EditPost.jsx
import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditPost = ({
  editData,
  handleInputChange,
  handleImageChange,
  handleQuillChange,
  updatePost,
  setIsEditing,
}) => {
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  return (
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
  );
};

export default EditPost;
