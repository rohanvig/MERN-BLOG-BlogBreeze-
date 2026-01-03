import { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const isPremiumSubscriber = true; // This should ideally come from user state or context

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  const fetchPost = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/post/getposts?slug=${postSlug}&includePremium=${isPremiumSubscriber}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch post");
      }
      setPost(data.posts[0]);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/post/getposts?limit=2`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setRecentPosts(data.posts);
      } else {
        throw new Error("Failed to fetch recent posts");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-500 text-xl font-medium">{error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300 text-xl font-medium">
          No post found
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-8 sm:mb-12">
          {/* Category Badge */}
          <Link
            to={`/search?category=${post.category}`}
            className="inline-block mb-6 transition-transform hover:scale-105"
          >
            <Button color="gray" pill size="xs" className="font-medium">
              {post.category}
            </Button>
          </Link>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={post.createdAt} className="font-medium">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>

            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {(post.content.length / 1000).toFixed(0)} min read
            </span>

            {post.views !== undefined && (
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {post.views.toLocaleString()}
              </span>
            )}
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 sm:mb-16 -mx-4 sm:mx-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-[500px] sm:max-h-[600px] object-cover sm:rounded-2xl shadow-xl"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-teal-600 dark:prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-700 prose-pre:shadow-lg max-w-none mb-12 sm:mb-16">
          <div
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Call to Action */}
        <div className="mb-12 sm:mb-16">
          <CallToAction />
        </div>

        {/* Comments Section */}
        <div className="mb-16 sm:mb-20">
          <CommentSection postId={post._id} />
        </div>

        {/* Recent Articles */}
        <aside className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Recent Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {recentPosts.map((recentPost) => (
              <PostCard key={recentPost._id} post={recentPost} />
            ))}
          </div>
        </aside>
      </article>
    </main>
  );
}
