import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Med-Sync | AI Prescription Parser",
  description: "An incredibly efficient, highly accessible, automated medical prescription reading tool powered completely by Google Cloud Services and Gemini AI.",
  keywords: ["medical", "prescription", "gemini", "Google Cloud", "AI", "healthcare", "OCR"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <a href="#main-content" className="sr-only focus:not-sr-only bg-blue-600 text-white px-4 py-2 absolute top-0 left-0 z-50">
          Skip to main content
        </a>
        <nav role="navigation" aria-label="Main Navigation" className="w-full bg-white shadow py-4 px-6 fixed top-0 w-full z-40">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
             <span className="font-bold text-xl text-blue-700">Med-Sync Engine</span>
             <ul className="flex space-x-4" role="menubar">
                <li role="none"><a href="/" role="menuitem" className="text-gray-600 hover:text-blue-600 focus:outline-none focus:underline" tabIndex={0}>Home</a></li>
             </ul>
          </div>
        </nav>
        <div id="main-content" className="pt-20 flex-grow">
          {children}
        </div>
      </body>
    </html>
  );
}
