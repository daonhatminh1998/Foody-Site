import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import BlogGrid from "./pages/BlogGrid";
import HomePage from "./pages/HomePage";
import CustomerReview from "./pages/CustomerReview";
import OurFeatures from "./pages/OurFeatures";
import OurProducts from "./pages/OurProducts";
import PageNotFound from "./pages/PageNotFound";
import DetailPages from "./pages/DetailPages";

const routes = [
  { path: "/", component: <HomePage /> },
  { path: "/HomePage", component: <HomePage /> },
  { path: "/AboutUs", component: <AboutUs /> },
  { path: "/BlogGrid", component: <BlogGrid /> },
  { path: "/ContactUs", component: <ContactUs /> },
  { path: "/CustomerReview", component: <CustomerReview /> },
  { path: "/OurFeatures", component: <OurFeatures /> },
  { path: "/Products", component: <OurProducts /> },
  { path: "/PageNotFound", component: <PageNotFound /> },
  { path: "/Product/:id", component: <DetailPages /> },
  { path: "/*", component: <PageNotFound /> },
];

export default routes;
