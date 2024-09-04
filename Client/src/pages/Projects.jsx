import CallToAction from '../components/CallToAction';

export default function Projects() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center flex-col gap-8 p-6">
      <div className="max-w-3xl mx-auto text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-teal-600 dark:text-teal-300 mb-4">
          Our Projects
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Explore our collection of fun and engaging projects that help you learn and master HTML, CSS, and JavaScript. Each project is designed to be both educational and enjoyable, providing practical experience while enhancing your skills.
        </p>
        <p className="text-md text-gray-500 dark:text-gray-300 mb-8">
          Whether you're a beginner looking to build your first website or an experienced developer seeking new challenges, you'll find projects that match your level and interests. Dive in and start building today!
        </p>
        <CallToAction />
      </div>
    </div>
  );
}
