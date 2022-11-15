import { createContext, useContext, useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { updateInfo } from ".././store/reducers/auth";
import userService from "../services/userService";

import ProductDetailService from "../services/productDetailService";

import { ShoppingCart } from "../components/shoppingCart/ShoppingCart";

const CartStateContext = createContext();
export const useCart = () => useContext(CartStateContext);

export const CartProvider = ({ children }) => {
  // trạng thái giỏ hàng

  const [isOpen, setIsOpen] = useState(false);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  //---------------------Product List------------------------------------------
  const RECORDS_PER_PAGE = 6;
  const [productDetail, setProductDetail] = useState([]);
  const [page, setPage] = useState(0);
  const [pageLength] = useState(RECORDS_PER_PAGE);
  const [pagingItems, setPagingItems] = useState([]);

  const loadData = () => {
    ProductDetailService.getPaging(page, pageLength).then((res) => {
      setProductDetail(res.data);

      const last = res.pagingInfo.totalPages - 1;
      var left = page - 2,
        right = page + 2 + 1,
        range = [],
        rangeWithDots = [];
      let l;

      for (let i = 0; i <= last; i++) {
        if (i === 0 || i === last || (i >= left && i < right)) {
          range.push(i);
        }
      }

      // console.log(range);
      //mũi tên
      if (res.pagingInfo.totalPages > 0) {
        rangeWithDots = [
          <Pagination.First
            key="frist"
            disabled={page === 0}
            onClick={() => setPage(0)}
          />,
          <Pagination.Prev
            key="Previous"
            disabled={page === 0}
            onClick={() => setPage(res.pagingInfo.page - 1)}
          />,
        ];
      }

      for (let i of range) {
        if (l) {
          if (i - l === 4) {
            rangeWithDots.push(<Pagination.Ellipsis key={l + 1} disabled />);
          } else if (i - l !== 1) {
            rangeWithDots.push(<Pagination.Ellipsis key="..." disabled />);
          }
        }

        rangeWithDots.push(
          <Pagination.Item
            key={i}
            active={i === page}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </Pagination.Item>
        );
        l = i;
      }

      //mũi tên cuối

      rangeWithDots.push(
        <Pagination.Next
          key="Next"
          disabled={page === res.pagingInfo.totalPages - 1}
          onClick={() => setPage(res.pagingInfo.page + 1)}
        />,
        <Pagination.Last
          key="last"
          disabled={page === res.pagingInfo.totalPages - 1}
          onClick={() => setPage(res.pagingInfo.totalPages - 1)}
        />
      );

      setPagingItems(rangeWithDots);
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageLength]);

  //---------------------BackEnd (New)------------------------------------------
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  var cartItem = [];
  if (isLoggedIn) {
    cartItem = userInfo.cart.cart_detail.map((item) => ({
      id: item.ProDe_Id,
      quantity: item.CartDe_Quantity,
      select: item.is_Selected,
      price: item.CartDe_Price,
    }));
  }

  const totalItem = cartItem.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  function getItem(id) {
    return cartItem.find((item) => item.id === id)?.quantity || 0;
  }

  function selectItem(id, select) {
    if (isLoggedIn) {
      userService.selectItem(id, select).then((res) => {
        if (res.errorCode === 0) {
          const newInfo = {
            ...userInfo,
            cart: res.data[1],
          };

          dispatch(
            updateInfo({
              userInfo: newInfo,
            })
          );
        }
      });
    } else {
      console.log("please Login");
    }
  }

  function addItem(id) {
    if (isLoggedIn) {
      userService.addQuantity(id).then((res) => {
        if (res.errorCode === 0) {
          const newInfo = {
            ...userInfo,
            cart: res.data[1],
          };

          dispatch(
            updateInfo({
              userInfo: newInfo,
            })
          );
        }
      });
    } else {
      console.log("please Login");
    }
  }

  function removeItem(id) {
    if (isLoggedIn) {
      userService.removeQuantity(id).then((res) => {
        if (res.errorCode === 0) {
          const newInfo = {
            ...userInfo,
            cart: res.data[1],
          };
          dispatch(
            updateInfo({
              userInfo: newInfo,
            })
          );
        }
      });
    } else {
      console.log("please Login");
    }
  }

  function deleteItem(id) {
    if (isLoggedIn) {
      userService.deleteItem(id).then((res) => {
        if (res.errorCode === 0) {
          const newInfo = {
            ...userInfo,
            cart: res.data[1],
          };
          dispatch(
            updateInfo({
              userInfo: newInfo,
            })
          );
        }
      });
    } else {
      console.log("please Login");
    }
  }

  function deleteAll() {
    if (isLoggedIn) {
      userService.deleteAll().then((res) => {
        if (res.errorCode === 0) {
          const newInfo = {
            ...userInfo,
            cart: res.data[1],
          };
          dispatch(
            updateInfo({
              userInfo: newInfo,
            })
          );
        }
      });
    } else {
      console.log("please Login");
    }
  }

  return (
    <CartStateContext.Provider
      value={{
        pagingItems,
        productDetail,
        openCart,
        closeCart,

        getItem,
        selectItem,
        addItem,
        removeItem,
        deleteItem,
        deleteAll,
        cartItem,
        totalItem,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </CartStateContext.Provider>
  );
};
