import type { Metadata } from 'next';
import React from 'react';
import './globals.css'; // Import global styles
import FaviconButton from "./components/FaviconButton";

export const metadata: Metadata = {
  title: 'Block Randomization',
  description: 'Visualization of block randomization',
};

// Define the props type including children
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <header className="header">
          <FaviconButton />
          <div className="title-container">
            <h1 className="title">
              Block Randomization
            </h1>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}