import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import SignUp from "./pages/Signup";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PaymentComponent from "./components/PaymentComponent";
import PremiumPostPage from "./pages/PremiumPostPage";
import { Privacy } from "./components/Privacy";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute copy";
import MainLayout from "./components/MainLayout"; // Import the new layout

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Routes WITHOUT header/footer (auth pages, etc.) */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route
          path="/reset_password/:userId/:token"
          element={<ResetPassword />}
        />

        {/* All other routes WITH header/footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
          <Route path="/premium" element={<PremiumPostPage />} />{" "}
          {/* Note: this was inside PrivateRoute before; moved out for layout */}
          <Route path="/privacy" element={<Privacy />} />
          {/* Protected routes (still get header/footer) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment" element={<PaymentComponent />} />
          </Route>
          {/* Admin routes */}
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
