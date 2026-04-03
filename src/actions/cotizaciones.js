'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getCotizacion(id) {
  const url = `${endpoints.cotizaciones.getCotizacion}?id=${id}`;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function getTablaCotizaciones(paginationModel, filterModel) {
  const url = endpoints.cotizaciones.getTablaCotizaciones;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        filterModel,
      },
    })
    .then((res) => res.data)
    .catch((error) => {});
}

export async function eliminarProductoCotizacion(id) {
  const url = endpoints.cotizaciones.eliminarProductoCotizacion;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Producto eliminado',
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

export async function actualizarProductoCotizacion(id, precio, precioUSD, cantidad) {
  const url = endpoints.cotizaciones.actualizarProductoCotizacion;

  return axiosServer()
    .post(url, {
      id,
      precio,
      precioUSD,
      cantidad,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Producto actualizado',
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

// ----------------------------------------------------------------------

export async function getTablaAgregarProductosCotizacion(paginationModel, filterModel) {
  const url = endpoints.cotizaciones.getTablaAgregarProductosCotizacion;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        filterModel,
      },
    })
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function agregarProductoCotizacion(id, id_producto) {
  const url = endpoints.cotizaciones.agregarProductoCotizacion;

  return axiosServer()
    .post(url, {
      id,
      id_producto,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Producto agregado',
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

// ----------------------------------------------------------------------

export async function eliminarRefaccionCotizacion(id) {
  const url = endpoints.cotizaciones.eliminarRefaccionCotizacion;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Refaccion eliminado',
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

export async function actualizarRefaccionCotizacion(id, precio, precioUSD, cantidad) {
  const url = endpoints.cotizaciones.actualizarRefaccionCotizacion;

  return axiosServer()
    .post(url, {
      id,
      precio,
      precioUSD,
      cantidad,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Refaccion actualizado',
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

// ----------------------------------------------------------------------

export async function getTablaAgregarRefaccionesCotizacion(paginationModel, filterModel) {
  const url = endpoints.cotizaciones.getTablaAgregarRefaccionesCotizacion;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        filterModel,
      },
    })
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function agregarRefaccionCotizacion(id, id_refaccion) {
  const url = endpoints.cotizaciones.agregarRefaccionCotizacion;

  return axiosServer()
    .post(url, {
      id,
      id_refaccion,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Refaccion agregada',
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

export async function guardarEnvio(id, envio) {
  const url = endpoints.cotizaciones.guardarEnvio;

  return axiosServer()
    .post(url, {
      id,
      envio,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Envío actualizado',
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

export async function aplicarDescuento(id, descuento) {
  const url = endpoints.cotizaciones.aplicarDescuento;

  return axiosServer()
    .post(url, {
      id,
      descuento,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Descuento aplicado',
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

// ----------------------------------------------------------------------

export async function actualizarForzarIva(id, forzar_iva) {
  const url = endpoints.cotizaciones.actualizarForzarIva;

  return axiosServer()
    .post(url, {
      id,
      forzar_iva,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Forzar IVA actualizado',
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

export async function enviarCotizacion(
  id,
  para,
  copiaPara,
  mensaje,
  tiempoEntrega,
  moneda,
  envioRapido,
  fecha
) {
  const url = endpoints.cotizaciones.enviarCotizacion;

  return axiosServer()
    .post(url, {
      id,
      para,
      copiaPara,
      mensaje,
      tiempoEntrega,
      moneda,
      envioRapido,
      fecha,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Cotización enviada',
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

export async function registrarCotizacion(id_cliente) {
  const url = endpoints.cotizaciones.registrarCotizacion;

  return axiosServer()
    .post(url, {
      id_cliente,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Cotización registrada',
        data: res.data,
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

export async function hacerPedido(id) {
  const url = endpoints.cotizaciones.hacerPedido;

  return axiosServer()
    .post(url, {
      id,
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
