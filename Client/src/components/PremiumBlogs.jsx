import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PremiumBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/post/premium-blogs'); // Update this endpoint as needed
        setBlogs(response.data);
        console.log("success");
        
      } catch (err) {
        setError('Failed to fetch premium blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Premium Blogs</h1>
      {blogs.length === 0 ? (
        <p>No premium blogs available at the moment.</p>
      ) : (
        blogs.map(blog => (
          <div key={blog._id} className="blog-card">
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <small>{new Date(blog.createdAt).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
