'use client';

import { useState, useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Menandakan bahwa komponen sudah dirender di sisi klien
  }, []);

  if (!isClient) return null; // Jangan render elemen di sisi server

  return <div>{children}</div>;
}
