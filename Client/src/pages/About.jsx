export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-5">
      <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-teal-600 dark:text-teal-300 text-center my-7">
          About BlogBreeze
        </h1>
        <div className="text-lg text-gray-700 dark:text-gray-300 flex flex-col gap-6">
          <p>
            Welcome to <strong>BlogBreeze</strong>! Our mission is to create a
            platform where passionate individuals can share their thoughts,
            ideas, and knowledge with a global audience. Whether you're a
            seasoned developer, a budding entrepreneur, or someone with a unique
            perspective, BlogBreeze is the place for you.
          </p>

          <p>
            On this platform, you'll find weekly articles and tutorials on web
            development, software engineering, programming languages, and more.
            We strive to offer valuable content that helps our readers stay
            informed and enhance their skills. Be sure to check back often for
            new and exciting content!
          </p>

          <p>
            We encourage active engagement from our community. Feel free to
            leave comments, like and reply to other readers' comments, and
            participate in discussions. Your involvement helps us build a
            vibrant and supportive community of learners.
          </p>

          <h2 className="text-2xl font-semibold text-teal-600 dark:text-teal-300 my-5">
            For Admins and Contributors
          </h2>

          <p>
            BlogBreeze offers robust tools for administrators and contributors.
            Admins have access to a comprehensive dashboard that allows them to
            manage content, review user activities, and handle moderation tasks.
            With our intuitive admin panel, you can easily manage posts, track
            user interactions, and ensure that the platform runs smoothly.
          </p>

          <p>
            If you're interested in joining our team of contributors or have any
            questions, please don't hesitate to reach out. For queries, contact
            us at: +919350262380 or email us at{" "}
            <strong>rohanvig777@gmail.com</strong>.
          </p>

          <h2 className="text-2xl font-semibold text-teal-600 dark:text-teal-300 my-5">
            Stay Connected
          </h2>

          <p>
            Follow us on social media to stay updated with the latest news and
            articles. We are active on{" "}
            <a
              href="https://www.facebook.com/rohan.kumar0112/"
              className="text-teal-500 dark:text-teal-300 hover:underline"
            >
              Facebook
            </a>
            ,{" "}
            <a
              href="https://www.instagram.com/rohanvig7844/"
              className="text-teal-500 dark:text-teal-300 hover:underline"
            >
              Instagram
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/rohankumar2/"
              className="text-teal-500 dark:text-teal-300 hover:underline"
            >
              LinkedIn
            </a>
            , and{" "}
            <a
              href="https://github.com/rohanvig"
              className="text-teal-500 dark:text-teal-300 hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
