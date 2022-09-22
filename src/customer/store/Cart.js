import { createContext, useContext, useEffect, useState } from "react";
import productService from "../../services/productDetailService";
import { ShoppingCart } from "../components/shoppingCart/ShoppingCart";
import useLocalStorage from "../hooks/useLocalStorage";

const CartStateContext = createContext();
export const useCart = () => useContext(CartStateContext);

export const CartProvider = ({ children }) => {
  // authSlice = createSlice

  const [cartItems, setCartItems] = useLocalStorage("shopping-cart", []);
  const [products, setProducts] = useState([]);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const loadData = () => {
    productService.list().then((res) => {
      setProducts(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // trạng thái giỏ hàng
  const [isOpen, setIsOpen] = useState(false);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  //action(reducer)
  function getItemQuantity(id) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(id) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
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
        return currItems.filter((item) => item.id !== id);
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

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartStateContext.Provider
      value={{
        products,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        clearCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </CartStateContext.Provider>
  );
};
