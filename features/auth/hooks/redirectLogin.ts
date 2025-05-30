'use client'

import { useRouter } from 'next/navigation';

const useRedirect = () => {
  const router = useRouter();

  const redirectToLogin = () => {
    router.push('/auth/login');
  };

  return redirectToLogin;
};

export default useRedirect;