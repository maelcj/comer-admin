'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

export async function getGraficaPedidos(fechaInicio, fechaFin) {
  const url = endpoints.index.getGraficaPedidos;

  return axiosServer()
    .get(url, {
      params: {
        fechaInicio,
        fechaFin,
      },
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

export async function getTotalPedidos(fechaInicio, fechaFin) {
  const url = endpoints.index.getTotalPedidos;

  return axiosServer()
    .get(url, {
      params: {
        fechaInicio,
        fechaFin,
      },
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
