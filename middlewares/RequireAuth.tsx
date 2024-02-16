// components/RequireAuth.tsx

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const RequireAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const { replace } = useRouter();

    useEffect(() => {
      const token = Cookies.get('token');
      if (!token) {
        replace('/'); // Redirect to the login page if the token is not found
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default RequireAuth;