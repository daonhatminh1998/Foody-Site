import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

const adminRoutes = [
  { path: "/", component: <AdminPage /> },
  { path: "/adminPage", component: <AdminPage /> },
  { path: "/ProductDetail", component: <ProductDetail /> },
  { path: "/products", component: <Products /> },
  { path: "/customers", component: <Customers /> },
  { path: "/orders", component: <Orders /> },
  { path: "/orderDetail", component: <OrderDetail /> },
  { path: "/*", component: <NotFound /> },
];

export default adminRoutes;
