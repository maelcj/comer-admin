'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function buscarCotizaciones(search) {
  const url = endpoints.omnisearch.buscarCotizaciones;

  return axiosServer()
    .post(url, {
      search,
    })
    .then((res) => res.data)
    .catch((error) => {
      const message = {
        type: 'error',
        message: error.message
          ? error.message
          : error.response
            ? error
            : error || 'Algo salió mal!',
      };
      return message;
    });
}

export async function buscarPedidos(search) {
  const url = endpoints.omnisearch.buscarPedidos;

  return axiosServer()
    .post(url, {
      search,
    })
    .then((res) => res.data)
    .catch((error) => {
      const message = {
        type: 'error',
        message: error.message
          ? error.message
          : error.response
            ? error
            : error || 'Algo salió mal!',
      };
      return message;
    });
}

export async function buscarClientes(search) {
  const url = endpoints.omnisearch.buscarClientes;

  return axiosServer()
    .post(url, {
      search,
    })
    .then((res) => res.data)
    .catch((error) => {
      const message = {
        type: 'error',
        message: error.message
          ? error.message
          : error.response
            ? error
            : error || 'Algo salió mal!',
      };
      return message;
    });
}
