import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('smart_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedSlot, setSelectedSlot] = useState(() => {
    const saved = localStorage.getItem('smart_slot');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('smart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (selectedSlot) {
      localStorage.setItem('smart_slot', JSON.stringify(selectedSlot));
    } else {
      localStorage.removeItem('smart_slot');
    }
  }, [selectedSlot]);

  const addToCart = (food, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item._id === food._id || item.foodId === food._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          _id: food._id,
          foodId: food._id,
          name: food.name,
          price: food.price,
          category: food.category,
          image: food.image,
          quantity
        }];
      }
    });
  };

  const addComboToCart = (combo) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.comboId === combo._id);
      if (existing) {
        return prev.map(item => item.comboId === combo._id
          ? { ...item, quantity: item.quantity + 1 }
          : item);
      }

      return [...prev, {
        _id: `combo-${combo._id}`,
        comboId: combo._id,
        name: combo.name,
        description: combo.description,
        price: combo.price,
        image: combo.image,
        category: 'Combo',
        isCombo: true,
        quantity: 1
      }];
    });
  };

  const updateQuantity = (foodId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item._id === foodId || item.foodId === foodId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems(prev => prev.filter(item => item._id !== foodId && item.foodId !== foodId));
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedSlot(null);
    localStorage.removeItem('smart_cart');
    localStorage.removeItem('smart_slot');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    selectedSlot,
    setSelectedSlot,
    addToCart,
    addComboToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItemsCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
