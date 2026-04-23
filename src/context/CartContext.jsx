import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart_selection');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart_selection', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart((prev) => {
            // Avoid duplicates
            const exists = prev.find(i => i.id === item.id && i.type === item.type);
            if (exists) return prev;
            return [...prev, item];
        });
    };

    const removeFromCart = (itemId, itemType) => {
        setCart((prev) => prev.filter(i => !(i.id === itemId && (itemType ? i.type === itemType : true))));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
