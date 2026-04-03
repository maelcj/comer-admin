import { setCookie, deleteCookie } from 'cookies-next';

import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { STORAGE_KEY } from './constant';

// Define cookie options to match what's used in auth-provider.jsx
const cookieOptions = {
  domain: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_DOMAIN : undefined,
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

// ----------------------------------------------------------------------

export function jwtDecode(token) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export async function tokenExpired(accessToken) {
  const decodedToken = jwtDecode(accessToken);
  const { exp } = decodedToken;

  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(async () => {
    try {
      const newToken = await refreshToken();

      if (!newToken) {
        alert('Token expired!');
        sessionStorage.removeItem(STORAGE_KEY);
        window.location.href = paths.auth.jwt.signIn;
      }
    } catch (error) {
      console.error('Error during token expiration:', error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------

export async function refreshToken() {
  try {
    return axios.post('/api/refresh').then((response) => {
      const { access_token } = response.data;

      if (!access_token) {
        return false;
      }

      // Use consistent cookie options
      setCookie('accessToken', access_token, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7,
      });

      setSession(access_token);
      return access_token;
    });
  } catch (error) {
    return false;
  }
}

// ----------------------------------------------------------------------

/* CHANGE función modificada para usar cookies */

export async function setSession(accessToken) {
  try {
    if (accessToken) {
      sessionStorage.removeItem(STORAGE_KEY);
      delete axios.defaults.headers.common.Authorization;

      sessionStorage.setItem(STORAGE_KEY, accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      const decodedToken = jwtDecode(accessToken);

      if (decodedToken && 'exp' in decodedToken) {
        tokenExpired(accessToken);
      } else {
        throw new Error('Invalid access token!');
      }
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      delete axios.defaults.headers.common.Authorization;

      // Delete cookie with same options as when it was set
      deleteCookie('accessToken');
      deleteCookie('accessToken', cookieOptions);
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}
