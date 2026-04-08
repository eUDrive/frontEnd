import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Car } from '../data/products';
import type { Certificate } from '../data/certificates';

export type CartItem = Car | Certificate;

export interface CartItemWithQuantity {
    item: CartItem;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItemWithQuantity[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: number) => void;
    removeAllFromCart: (itemId: number) => void;
    isInCart: (itemId: number) => boolean;
    updateQuantity: (itemId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItemWithQuantity[]>([]);

    const addToCart = (item: CartItem) => {
        setCartItems((prev) => {
            const existingItem = prev.find(cartItem => cartItem.item.id === item.id);
            if (existingItem) {
                return prev.map(cartItem =>
                    cartItem.item.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prev, { item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: number) => {
        setCartItems((prev) => prev.filter(cartItem => cartItem.item.id !== itemId));
    };

    const removeAllFromCart = (itemId: number) => {
        setCartItems((prev) => prev.filter(cartItem => cartItem.item.id !== itemId));
    };

    const isInCart = (itemId: number) => {
        return cartItems.some(cartItem => cartItem.item.id === itemId);
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCartItems((prev) =>
            prev.map(cartItem =>
                cartItem.item.id === itemId
                    ? { ...cartItem, quantity }
                    : cartItem
            )
        );
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, removeAllFromCart, isInCart, updateQuantity }}>
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
