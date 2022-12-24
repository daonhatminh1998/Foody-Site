/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { ShoppingCart } from "../components/shoppingCart/ShoppingCart";

import useLocalStorage from "./hooks/useLocalStorage";

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

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [cartItems, setCartItems] = useLocalStorage("shopping-cart", []);
  const [check, setCheck] = useState(cartItems);

  useEffect(() => {
    ProductDetailService.list().then((res) => {
      setItems(res.data);
    });
  }, [setItems]);

  if (isLoggedIn) {
    if (cartItems.length !== 0 && check !== cartItems) {
      const cart = { cartItem: cartItems };
      setTimeout(function () {
        // console.log("up lên back");
        cartService.updateCart(cart).then((res) => {
          if (res.errorCode === 0) {
            setCheck(cartItems);
          }
        });
      }, 10000);
    }
  }

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
    const clearItem = [];
    if (isLoggedIn) {
      cartService.deleteAll();
    }
    return setCartItems(clearItem);
  };

  //---------------------BackEnd------------------------------------------

  return (
    <CartStateContext.Provider
      value={{
        items,

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
