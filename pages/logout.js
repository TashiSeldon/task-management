// pages/logout.js

import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('token'); // Remove JWT from localStorage
    router.push('/login'); // Redirect to login page
  }, [router]);

  return <p>Logging out...</p>;
};

export default Logout;
