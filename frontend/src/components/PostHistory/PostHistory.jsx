import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

const PostHistory = () => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const title = location.state?.title || 'Untitled Post';


  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:3000/posts/${id}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch history');
        setHistory(data.history.reverse()); // newest first
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [id]);

  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="table-container">
      <h2>Modification History</h2>
      <Link to={`/post/${title}`} state={{ _id: id }}>⬅ Back to Post</Link>

      {loading ? (
        <p>Loading history...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : history.length > 0 ? (
        <ul className="history-list">
          {history.map((entry, index) => (
            <li key={index}>
              • {formatDate(entry.modifiedAt)} — updated: {entry.updatedFields.join(', ')}
            </li>
          ))}
        </ul>
      ) : (
        <p>No modification history found.</p>
      )}
    </div>
  );
};

export default PostHistory;
