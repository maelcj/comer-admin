'use client';

import { setCookie, getCookie } from 'cookies-next';
import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  /* CHANGE
   funcion modificada:
  1.- para que el accessToken se guarde una cookie que puedan usar las llamadas a la API
  2.- para que la sesión persista en el navegador
  */
  const checkUserSession = useCallback(async () => {
    try {
      let accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (!accessToken) {
        // check if accessToken is in cookie
        const cookieAccessToken = getCookie('accessToken');
        if (cookieAccessToken) {
          accessToken = cookieAccessToken;
        }
      }

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        setCookie('accessToken', accessToken, {
          domain:
            process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_DOMAIN : undefined,
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days (optional)
          path: '/', // Ensure cookie is available site-wide
        });

        const res = await axios.get(endpoints.auth.me);

        const { user } = res.data;

        setState({ user: { ...user, accessToken }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
