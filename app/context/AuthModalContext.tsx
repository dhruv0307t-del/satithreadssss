"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthModalContextType {
    isOpen: boolean;
    callbackUrl?: string;
    openModal: (callbackUrl?: string) => void;
    closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
    undefined
);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [callbackUrl, setCallbackUrl] = useState<string | undefined>();

    const openModal = (url?: string) => {
        setCallbackUrl(url);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setCallbackUrl(undefined);
    };

    return (
        <AuthModalContext.Provider
            value={{ isOpen, callbackUrl, openModal, closeModal }}
        >
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (context === undefined) {
        throw new Error("useAuthModal must be used within AuthModalProvider");
    }
    return context;
}
