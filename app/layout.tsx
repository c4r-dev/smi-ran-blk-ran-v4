// app/layout.tsx
'use client'; // <-- Add this line to make it a Client Component

import Image from 'next/image';
import "./globals.css"; // Import global styles

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // Function to handle the click and reload the page
  const handleResetClick = () => {
    window.location.reload(); // Reloads the current page
  };

  return (
    <html lang="en">
       {/* You might want to set the title dynamically using useEffect or a state management library if needed */}
       <head>
         <title>Block Randomization Tool</title>
         <meta name="Learn block randomization interactively" content="Learn block randomization interactively" />
         {/* Add other head elements like favicons here */}
         <link rel="icon" href="/favicon.ico" sizes="any" />
       </head>
      <body>
        <header className="header"> {/* Header class from globals.css */}
           <button
             className="favicon-button" // Favicon button class
             onClick={handleResetClick} // <-- Add onClick handler
             title="Reset Application" // Add a tooltip for clarity
            >
             <Image
               src="/favicon.ico"
               alt="Logo - Reset"
               width={40}
               height={40}
               className="favicon" // Favicon class
               priority // Add priority if it's important for LCP
             />
           </button>
           <div className="title-container"> {/* Title container class */}
             <h1 className="title">Block Randomization Tool</h1> {/* Title class */}
           </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}