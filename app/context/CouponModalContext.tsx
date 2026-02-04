"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CouponModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const CouponModalContext = createContext<CouponModalContextType | undefined>(
    undefined
);

export function CouponModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <CouponModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
        </CouponModalContext.Provider>
    );
}

export function useCouponModal() {
    const context = useContext(CouponModalContext);
    if (!context) {
        throw new Error("useCouponModal must be used within CouponModalProvider");
    }
    return context;
}
