import AuthProvider from "./AuthProvider";
import Header from "./(header)/Header";
import "./globals.css";

export const metadata = {
  title: "Coder Billing",
  description: "A billing system that uses the Coder API and Stripe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>
          <Header />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
