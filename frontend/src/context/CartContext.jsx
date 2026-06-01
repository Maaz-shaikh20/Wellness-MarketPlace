import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../api/axios";

const CartContext = createContext({ cartCount: 0, refreshCart: () => {} });

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (!userStr || !token) {
        setCartCount(0);
        return;
      }
      const user = JSON.parse(userStr);
      if (!user?.id) { setCartCount(0); return; }

      const res = await api.get(`/cart?userId=${user.id}`);
      const items = res.data || [];
      // Sum up quantities across all cart items
      const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } catch {
      // Silently fail — cart count defaults to 0
      setCartCount(0);
    }
  }, []);

  // Fetch cart count on mount and whenever localStorage changes (e.g. after login)
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
