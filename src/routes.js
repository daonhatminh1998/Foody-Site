import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import BlogGrid from "./pages/BlogGrid";
import HomePage from "./pages/HomePage";
import CustomerReview from "./pages/CustomerReview";
import OurFeatures from "./pages/OurFeatures";
import OurProducts from "./pages/OurProducts";
import PageNotFound from "./pages/PageNotFound";
import DetailPages from "./pages/DetailPages";
import User from "./pages/User";

const routes = [
  { path: "/", component: <HomePage /> },
  { path: "/Login", component: <Login /> },
  { path: "/HomePage", component: <HomePage /> },
  { path: "/AboutUs", component: <AboutUs /> },
  { path: "/BlogGrid", component: <BlogGrid /> },
  { path: "/ContactUs", component: <ContactUs /> },
  { path: "/CustomerReview", component: <CustomerReview /> },
  { path: "/OurFeatures", component: <OurFeatures /> },
  { path: "/OurProducts", component: <OurProducts /> },
  { path: "/PageNotFound", component: <PageNotFound /> },
  { path: "/Product/:id", component: <DetailPages /> },
  { path: "/User", component: <User /> },
  { path: "/*", component: <PageNotFound /> },
];

export default routes;
