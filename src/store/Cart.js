/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

import { useSelector } from "react-redux";

import { ShoppingCart } from "../components/shoppingCart/ShoppingCart";

import useLocalStorage from "./hooks/useLocalStorage";
import orderMemService from "../services/orderMemService";
import ProductDetailService from "../services/productDetailService";
import cartService from "../services/cartService";

const CartStateContext = createContext();
export const useCart = () => useContext(CartStateContext);

export const CartProvider = ({ children }) => {
  // trạng thái giỏ hàng

  const [isOpen, setIsOpen] = useState(false);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  //---------------------Product List------------------------------------------

  const [items, setItems] = useState([]);
  // const [receiver, setReceiver] = useState([]);

  const [productDetail, setProductDetail] = useState([]);
  const [page, setPage] = useState(0);
  const [pageLength] = useState(6);
  const [pagingItems, setPagingItems] = useState([]);

  const [order, setOrder] = useState([]);
  const [orderPage, setOrderPage] = useState(0);
  const [orderPageLength] = useState(4);
  const [orderPagingItems, setOrderPagingItems] = useState([]);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [cartItems, setCartItems] = useLocalStorage("shopping-cart", []);
  const [check, setCheck] = useState([cartItems]);

  if (isLoggedIn) {
    if (cartItems.length !== 0 && check !== cartItems) {
      const cart = { cartItem: cartItems };
      setTimeout(function () {
        cartService.updateCart(cart).then((res) => {
          setCheck(cartItems);
        });
      }, 10000);
    }
  }

  const loadOrder = () => {
    if (isLoggedIn) {
      orderMemService.getPaging(orderPage, orderPageLength).then((res) => {
        setOrder(res.data);
        const last = res.pagingInfo.totalPages - 1;
        var left = orderPage - 2,
          right = orderPage + 2 + 1,
          range = [],
          rangeWithDots = [];
        let l;
        for (let i = 0; i <= last; i++) {
          if (i === 0 || i === last || (i >= left && i < right)) {
            range.push(i);
          }
        }
        //mũi tên
        if (res.pagingInfo.totalPages > 0) {
          rangeWithDots = [
            <Pagination.First
              key="frist"
              disabled={orderPage === 0}
              onClick={() => setOrderPage(0)}
            />,
            <Pagination.Prev
              key="Previous"
              disabled={orderPage === 0}
              onClick={() => setOrderPage(res.pagingInfo.page - 1)}
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
              active={i === orderPage}
              onClick={() => setOrderPage(i)}
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
            disabled={orderPage === res.pagingInfo.totalPages - 1}
            onClick={() => setOrderPage(res.pagingInfo.page + 1)}
          />,
          <Pagination.Last
            key="last"
            disabled={orderPage === res.pagingInfo.totalPages - 1}
            onClick={() => setOrderPage(res.pagingInfo.totalPages - 1)}
          />
        );
        setOrderPagingItems(rangeWithDots);
      });
    }
  };
  const loadData = () => {
    ProductDetailService.list().then((res) => {
      setItems(res.data);
    });

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
    loadOrder();
  }, [page, pageLength, orderPage, orderPageLength]);

  //---------------------FrontEnd------------------------------------------

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  function getItemQuantity(id) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function selectItem(id, select) {
    setCartItems((currItems) => {
      return currItems.map((item) => {
        if (item.id === id && item.select !== select) {
          return { ...item, select: select };
        } else {
          return item;
        }
      });
    });
  }

  function increaseCartQuantity(id) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1, select: 0 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems;
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  function removeItem() {
    const removeItem = [];
    cartItems.map((item) =>
      !item.select
        ? removeItem.push({
            id: item.id,
            quantity: item.quantity,
            select: item.select,
          })
        : 0
    );
    return setCartItems(removeItem);
  }

  const clearCart = () => {
    if (isLoggedIn) {
      cartService.deleteAll();
    }
    setCartItems([]);
  };

  //---------------------BackEnd------------------------------------------

  return (
    <CartStateContext.Provider
      value={{
        items,
        loadData,

        order,
        orderPagingItems,

        pagingItems,
        productDetail,

        openCart,
        closeCart,

        cartItems,
        setCartItems,
        cartQuantity,
        removeItem,
        clearCart,

        getItemQuantity,
        selectItem,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </CartStateContext.Provider>
  );
};
