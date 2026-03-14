"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

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
    const { status } = useSession();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // Auto-open logic after login
    useEffect(() => {
        if (status === "authenticated") {
            const shouldOpen = localStorage.getItem("openCheckoutAfterLogin");
            if (shouldOpen === "true") {
                openModal();
                localStorage.removeItem("openCheckoutAfterLogin");
            }
        }
    }, [status]);

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
