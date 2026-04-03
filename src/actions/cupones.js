'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getCupones(search) {
  const url = endpoints.cupones.getCupones;

  return axiosServer()
    .get(url)
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

export async function actualizarCupon(
  id,
  cupon,
  caducidad,
  porcentaje_descuento,
  marcas,
  tipos,
  mpns
) {
  const url = endpoints.cupones.actualizarCupon;

  return axiosServer()
    .post(url, { id, cupon, caducidad, porcentaje_descuento, marcas, tipos, mpns })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Cupón actualizado',
      };
      return message;
    })
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

export async function eliminarCupon(id) {
  const url = endpoints.cupones.eliminarCupon;

  return axiosServer()
    .post(url, { id })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Cupón eliminado',
      };
      return message;
    })
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

export async function registrarCupon() {
  const url = endpoints.cupones.registrarCupon;

  return axiosServer()
    .post(url)
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Cupón registrado',
      };
      return message;
    })
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
