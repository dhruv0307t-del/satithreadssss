import "./globals.css";
import "./festive.css";
import CartDrawer from "./components/CartDrawer";
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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <AuthModalProvider>
            <CouponModalProvider>
              <CheckoutModalProvider>
                <CartProvider>
                  {children}
                  <CartDrawer />
                  <LoginModal />
                  <CheckoutModal />
                </CartProvider>
              </CheckoutModalProvider>
            </CouponModalProvider>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
