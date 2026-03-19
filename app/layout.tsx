import "./globals.css";
import "./festive.css";
import CartDrawer from "./components/CartDrawer";
import SearchDrawer from "./components/SearchDrawer";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import AuthProvider from "./context/AuthProvider";
import { AuthModalProvider } from "./context/AuthModalContext";
import { CouponModalProvider } from "./context/CouponModalContext";
import { CheckoutModalProvider } from "./context/CheckoutModalContext";
import LoginModal from "./components/LoginModal";
import CheckoutModal from "./components/CheckoutModal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <AuthModalProvider>
            <CouponModalProvider>
              <CheckoutModalProvider>
                <CartProvider>
                  <SearchProvider>
                    {children}
                    <CartDrawer />
                    <SearchDrawer />
                    <LoginModal />
                    <CheckoutModal />
                  </SearchProvider>
                </CartProvider>
              </CheckoutModalProvider>
            </CouponModalProvider>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
