'use client'; // Wajib agar bisa pakai useRouter

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard'); // Redirect ke /dashboard
  }, [router]);

  return null;
}
