import { useRouter } from 'next/router';

const useRedirect = () => {
  const router = useRouter();

  const redirectToLogin = () => {
    router.push('/auth/login');
  };

  return redirectToLogin;
};

export default useRedirect;