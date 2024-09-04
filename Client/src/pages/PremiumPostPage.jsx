import axios from "axios";
import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";

export default function PremiumPostPage() {
  const [premiumPosts, setPremiumPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPremiumPosts = async () => {
      try {
        const accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1]; // Extract the access_token from the cookie

        const res = await axios.get("/api/post/premium-blogs", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access_token in the request
          },
        });

        console.log("API Response:", res.status, res.data); // Log the response for debugging

        if (res.status === 200 && res.data.message === "success") {
          setPremiumPosts(res.data.blogs);
        } else if (res.status === 403) {
          console.log("User is not authorized. Redirecting to payment page...");
          navigate("/payment");
        } else {
          setError(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Caught 403 error. Redirecting to payment page...");
          navigate("/payment");
        } else {
          console.error("Error fetching premium posts:", error);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumPosts();
  }, [navigate]);

  if (loading) {
    return <div>Loading premium posts...</div>;
  }

  if (error) {
    return <div>Failed to load premium posts.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-2">
      <h1 className="text-3xl font-bold lg:text-4xl text-center">
        Premium Posts
      </h1>
      <div className="flex flex-wrap gap-4">
        {premiumPosts && premiumPosts.length > 0 ? (
          premiumPosts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p>No premium posts available at the moment.</p>
        )}
      </div>
    </div>
  );
}
