import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

// Retrieve the API URL from the environment variable
const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/getusers?limit=5`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/post/getposts?limit=5`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/api/comment/getcomments?limit=5`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  // Prepare chart data
  const pieChartData = [
    { name: "Users", value: totalUsers, color: "#14b8a6" },
    { name: "Posts", value: totalPosts, color: "#84cc16" },
    { name: "Comments", value: totalComments, color: "#6366f1" },
  ];

  const growthData = [
    { name: "Users", current: totalUsers, lastMonth: lastMonthUsers },
    { name: "Posts", current: totalPosts, lastMonth: lastMonthPosts },
    { name: "Comments", current: totalComments, lastMonth: lastMonthComments },
  ];

  const trendData = [
    {
      month: "Last Month",
      users: lastMonthUsers,
      posts: lastMonthPosts,
      comments: lastMonthComments,
    },
    {
      month: "Current",
      users: totalUsers,
      posts: totalPosts,
      comments: totalComments,
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <HiOutlineUserGroup className="text-white text-2xl" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full font-medium">
                <HiArrowNarrowUp className="text-base" />
                {lastMonthUsers}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Last month
              </span>
            </div>
          </div>
        </div>

        {/* Total Comments Card */}
        <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Total Comments
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalComments.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <HiAnnotation className="text-white text-2xl" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full font-medium">
                <HiArrowNarrowUp className="text-base" />
                {lastMonthComments}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Last month
              </span>
            </div>
          </div>
        </div>

        {/* Total Posts Card */}
        <div className="group bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Total Posts
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalPosts.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <HiDocumentText className="text-white text-2xl" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full font-medium">
                <HiArrowNarrowUp className="text-base" />
                {lastMonthPosts}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                Last month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart - Content Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Content Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Growth Comparison */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Monthly Growth Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="dark:opacity-20"
              />
              <XAxis dataKey="name" className="dark:text-gray-400" />
              <YAxis className="dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar
                dataKey="lastMonth"
                fill="#94a3b8"
                name="Last Month"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="current"
                fill="#14b8a6"
                name="Current Total"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Trend Analysis */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Engagement Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="dark:opacity-20"
              />
              <XAxis dataKey="month" className="dark:text-gray-400" />
              <YAxis className="dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Users"
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#84cc16"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Posts"
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Comments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Users
            </h2>
            <Button
              outline
              gradientDuoTone="purpleToPink"
              size="sm"
              className="transition-transform hover:scale-105"
            >
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="bg-gray-50 dark:bg-gray-900/50">
                  User Image
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-50 dark:bg-gray-900/50">
                  Username
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y dark:divide-gray-700">
                {users &&
                  users.map((user) => (
                    <Table.Row
                      key={user._id}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <Table.Cell>
                        <img
                          src={user.profilePicture}
                          alt="user"
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                        />
                      </Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-gray-100">
                        {user.username}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>

        {/* Recent Comments Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Comments
            </h2>
            <Button
              outline
              gradientDuoTone="purpleToPink"
              size="sm"
              className="transition-transform hover:scale-105"
            >
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="bg-gray-50 dark:bg-gray-900/50">
                  Comment Content
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-50 dark:bg-gray-900/50">
                  Likes
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y dark:divide-gray-700">
                {comments &&
                  comments.map((comment) => (
                    <Table.Row
                      key={comment._id}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <Table.Cell className="max-w-xs">
                        <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
                          {comment.content}
                        </p>
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-semibold">
                          {comment.numberOfLikes}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>

        {/* Recent Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Posts
            </h2>
            <Button
              outline
              gradientDuoTone="purpleToPink"
              size="sm"
              className="transition-transform hover:scale-105"
            >
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="bg-gray-50 dark:bg-gray-900/50">
                  Post Image
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-50 dark:bg-gray-900/50">
                  Post Title
                </Table.HeadCell>
                <Table.HeadCell className="bg-gray-50 dark:bg-gray-900/50">
                  Category
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y dark:divide-gray-700">
                {posts &&
                  posts.map((post) => (
                    <Table.Row
                      key={post._id}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <Table.Cell>
                        <img
                          src={post.image}
                          alt="post"
                          className="w-16 h-12 rounded-lg object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                        />
                      </Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-gray-100 max-w-xs truncate">
                        {post.title}
                      </Table.Cell>
                      <Table.Cell>
                        <span className="inline-block px-3 py-1 bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400 rounded-full text-xs font-semibold uppercase tracking-wide">
                          {post.category}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
