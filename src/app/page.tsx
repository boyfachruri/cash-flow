'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';

const Home = () => {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(true);
   
   useEffect(() => {
     if (!isAuthenticated()) {
       // Redirect hanya di klien
       router.push('/login');
     } else {
       setIsLoading(false);
       router.push('/main/dashboard'); // Jika sudah login, selesai loading
     }
   }, [router]); 

  return null; // Tidak menampilkan apapun
};

export default Home;
