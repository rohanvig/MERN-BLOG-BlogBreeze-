import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:p-28 p-6 max-w-6xl mx-auto bg-gradient-to-b from-teal-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-lg shadow-lg">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-teal-600 dark:text-teal-300">
          Welcome
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl">
          Discover a variety of articles and tutorials on topics such as web
          development, software engineering, and more...
        </p>
        <Link
          to="/search"
          className="text-xl lg:text-2xl text-teal-500 dark:text-teal-300 font-bold hover:underline transition-all"
        >
          View all posts
        </Link>
      </div>

      {/* Call to Action Section */}
      <div className="p-6 bg-amber-100 dark:bg-slate-700 rounded-lg shadow-lg my-8">
        <CallToAction />
      </div>

      {/* Recent Posts Section */}
      <div className="max-w-6xl mx-auto p-6 flex flex-col gap-10">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold text-center text-teal-600 dark:text-teal-300">
              Recent Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-teal-500 dark:text-teal-300 hover:underline text-center transition-all"
            >
              View all posts
            </Link>
          </div>
        )}

        {/* View Premium Posts Section */}
        <div className="flex justify-center mt-8">
          <Link
            to="/premium"
            className="text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            View Premium Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
