import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false); // New state

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/signout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setShowMobileSearch(false); // Close mobile search after submit
  };

  return (
    <Navbar className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold tracking-tight"
          >
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              BlogBreeze
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSubmit}
            className="hidden md:flex flex-1 max-w-md mx-8" // Changed from lg:flex to md:flex
          >
            <div className="relative w-full">
              <TextInput
                type="text"
                placeholder="Search posts..."
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          {/* Right side: Theme, User, Mobile Search Icon */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Icon (visible only on small screens) */}
            <Button
              color="gray"
              pill
              size="sm"
              className="w-10 h-10 p-0 flex items-center justify-center md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <AiOutlineSearch className="w-5 h-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              color="gray"
              pill
              size="sm"
              className="w-10 h-10 p-0 flex items-center justify-center"
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? (
                <FaMoon className="w-4 h-4" />
              ) : (
                <FaSun className="w-4 h-4" />
              )}
            </Button>

            {/* User Menu or Sign In */}
            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <div className="rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-200 cursor-pointer">
                    <Avatar
                      alt="user"
                      img={currentUser.profilePicture}
                      rounded
                      size="md"
                    />
                  </div>
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm font-medium text-gray-900 dark:text-white">
                    @{currentUser.username}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                    {currentUser.email}
                  </span>
                </Dropdown.Header>
                <Link to={"/dashboard?tab=profile"}>
                  <Dropdown.Item className="text-sm">Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={handleSignout}
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  Sign out
                </Dropdown.Item>
              </Dropdown>
            ) : (
              <Link to="/sign-in">
                <Button
                  gradientDuoTone="purpleToBlue"
                  size="sm"
                  className="px-5 hidden sm:block"
                >
                  Sign In
                </Button>
              </Link>
            )}

            <Navbar.Toggle className="lg:hidden" />
          </div>
        </div>

        {/* Mobile Search Input (shown when icon clicked) */}
        {showMobileSearch && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <TextInput
                type="text"
                placeholder="Search posts..."
                className="flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <Button type="submit" color="gray" size="sm">
                <AiOutlineSearch className="w-5 h-5" />
              </Button>
            </form>
          </div>
        )}

        {/* Navigation Links */}
        <Navbar.Collapse>
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 space-y-2 lg:space-y-0 py-4 lg:py-0">
            <Navbar.Link active={path === "/"} as={"div"}>
              <Link
                to="/"
                className="block py-2 lg:py-0 text-base font-medium hover:text-purple-600 dark:hover:text-purple-400"
              >
                Home
              </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/about"} as={"div"}>
              <Link
                to="/about"
                className="block py-2 lg:py-0 text-base font-medium hover:text-purple-600 dark:hover:text-purple-400"
              >
                About
              </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/projects"} as={"div"}>
              <Link
                to="/projects"
                className="block py-2 lg:py-0 text-base font-medium hover:text-purple-600 dark:hover:text-purple-400"
              >
                Projects
              </Link>
            </Navbar.Link>
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
