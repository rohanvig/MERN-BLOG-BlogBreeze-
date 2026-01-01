import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [postsRes, featuredRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/post/getposts?limit=3`),
        fetch(`${BACKEND_URL}/api/post/getposts?featured=true&limit=3`),
      ]);

      const postsData = await postsRes.json();
      const featuredData = await featuredRes.json();
      if (postsRes.ok) setPosts(postsData.posts);
      if (featuredRes.ok) setFeaturedPosts(featuredData.posts);
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Learn. Build. Ship.
          </h1>
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            In-depth articles on web development, software engineering, and
            modern tech stacks—written by developers, for developers.
          </p>
          <div className="pt-4">
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-lg font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors group"
            >
              Explore all articles
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="my-24 lg:my-32">
        <div className="max-w-8xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 p-8 lg:p-12">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
            <div className="relative">
              <CallToAction />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        {posts && posts.length > 0 && (
          <div className="space-y-12">
            <div className="space-y-3">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                Recent Articles
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Fresh perspectives on modern development
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:gap-6 lg:gap-8 gap-12">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
        <div className="space-y-3">
          <svg
            className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          {featuredPosts?.length > 0 && (
            <div className="space-y-8 mb-20">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Editor’s Picks
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Posts CTA */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-16 pb-24 mt-16">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Premium Content
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
            Unlock expert-level tutorials
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Get access to in-depth guides, advanced patterns, and
            production-ready code samples.
          </p>
          <Link
            to="/premium"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-lg transition-colors shadow-sm"
          >
            Explore premium articles
          </Link>
        </div>
      </div>
    </div>
  );
}
