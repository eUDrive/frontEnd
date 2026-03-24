import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Car } from '../data/products';
import type { Certificate } from '../data/certificates';

export type CartItem = Car | Certificate;

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: number, itemType?: 'car' | 'certificate') => void;
    isInCart: (itemId: number, itemType?: 'car' | 'certificate') => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCartItems((prev) => [...prev, item]);
    };

    const removeFromCart = (itemId: number) => {
        setCartItems((prev) => prev.filter(item => item.id !== itemId));
    };

    const isInCart = (itemId: number) => {
        return cartItems.some(item => item.id === itemId);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isInCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
