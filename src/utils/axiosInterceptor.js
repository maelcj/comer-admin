import axios from 'axios';
import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export function axiosServer() {
  const instance = axios.create({ baseURL: CONFIG.site.serverUrl });

  const accessToken = getCookie('accessToken', { cookies });

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Algo salió mal!')
  );

  instance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers['Content-Type'] = 'application/json';
    config.headers.Accept = 'application/json';
    return config;
  });

  return instance;
}
// ----------------------------------------------------------------------

export function axiosFileServer() {
  const instance = axios.create({ baseURL: CONFIG.site.serverUrl });

  const accessToken = getCookie('accessToken', { cookies });

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Algo salió mal!')
  );

  instance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers['Content-Type'] = 'multipart/form-data';
    config.headers.Accept = 'application/json';
    return config;
  });

  return instance;
}

// ----------------------------------------------------------------------
