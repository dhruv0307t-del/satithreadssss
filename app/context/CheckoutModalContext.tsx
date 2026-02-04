"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CheckoutModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const CheckoutModalContext = createContext<CheckoutModalContextType | undefined>(
    undefined
);

export function CheckoutModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <CheckoutModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
        </CheckoutModalContext.Provider>
    );
}

export function useCheckoutModal() {
    const context = useContext(CheckoutModalContext);
    if (!context) {
        throw new Error("useCheckoutModal must be used within CheckoutModalProvider");
    }
    return context;
}
