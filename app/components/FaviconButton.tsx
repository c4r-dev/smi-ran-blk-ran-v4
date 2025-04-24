// app/components/FaviconButton.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function FaviconButton() {
  return (
    <Link href="/" className="favicon-button" aria-label="Homepage">
        <Image
          src="/favicon.ico"
          alt="Homepage"
          className="favicon"
          width={40}
          height={40}
          priority
        />
    </Link>
  );
}