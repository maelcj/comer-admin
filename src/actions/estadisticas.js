'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getTablaEstadisticas(paginationModel, filterModel, fechaInicio, fechaFin) {
  const url = endpoints.estadisticas.getTablaEstadisticas;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        filterModel,
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

export async function getResumenEstadisticas(fechaInicio, fechaFin) {
  const url = endpoints.estadisticas.getResumenEstadisticas;

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

export async function updatePublicidad(productoId, publicidad) {
  const url = endpoints.estadisticas.updatePublicidad;

  return axiosServer()
    .post(url, {
      productoId,
      publicidad,
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

export async function ejecutarProductosMerchant() {
  const url = endpoints.estadisticas.ejecutarProductosMerchant;

  return axiosServer()
    .post(url)
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
