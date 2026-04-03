'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer, axiosFileServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getPedido(id) {
  const url = `${endpoints.pedidos.getPedido}?id=${id}`;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function getTablaPedidos(paginationModel, filterModel, fechaInicio, fechaFin) {
  const url = endpoints.pedidos.getTablaPedidos;

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
    .catch((error) => {});
}

export async function eliminarProductoPedido(id) {
  const url = endpoints.pedidos.eliminarProductoPedido;

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

export async function actualizarProductoPedido(id, precio, precioUSD, cantidad) {
  const url = endpoints.pedidos.actualizarProductoPedido;

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

export async function getTablaAgregarProductosPedido(paginationModel, filterModel) {
  const url = endpoints.pedidos.getTablaAgregarProductosPedido;

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

export async function agregarProductoPedido(id, id_producto) {
  const url = endpoints.pedidos.agregarProductoPedido;

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

export async function eliminarRefaccionPedido(id) {
  const url = endpoints.pedidos.eliminarRefaccionPedido;

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

export async function actualizarRefaccionPedido(id, precio, precioUSD, cantidad) {
  const url = endpoints.pedidos.actualizarRefaccionPedido;

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

export async function getTablaAgregarRefaccionesPedido(paginationModel, filterModel) {
  const url = endpoints.pedidos.getTablaAgregarRefaccionesPedido;

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

export async function agregarRefaccionPedido(id, id_refaccion) {
  const url = endpoints.pedidos.agregarRefaccionPedido;

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
  const url = endpoints.pedidos.guardarEnvio;

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
  const url = endpoints.pedidos.aplicarDescuento;

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
  const url = endpoints.pedidos.actualizarForzarIva;

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

export async function guardarDatosEnvio(id, datosEnvio) {
  const url = endpoints.pedidos.guardarDatosEnvio;

  return axiosServer()
    .post(url, {
      id,
      datosEnvio,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Datos de envío actualizados',
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

export async function getDatosEnvioCliente(id) {
  const url = `${endpoints.pedidos.getDatosEnvioCliente}?id=${id}`;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error al obtener datos de envío del cliente:', error);
      return [];
    });
}

export async function getDatosFacturacionCliente(id) {
  const url = `${endpoints.pedidos.getDatosFacturacionCliente}?id=${id}`;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error al obtener datos de facturación del cliente:', error);
      return [];
    });
}

export async function subirFactura(id, formData) {
  formData.append('id', id);

  const url = endpoints.pedidos.subirFactura;

  return axiosFileServer()
    .post(url, formData)
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Archivo cargado',
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

export async function enviarFactura(id) {
  const url = endpoints.pedidos.enviarFactura;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Factura enviada',
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

export async function eliminarFactura(id) {
  const url = endpoints.pedidos.eliminarFactura;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Factura eliminada',
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

export async function guardarDatosFacturacion(id, datosFacturacion) {
  const url = endpoints.pedidos.guardarDatosFacturacion;

  return axiosServer()
    .post(url, {
      id,
      datosFacturacion,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Datos de facturación actualizados',
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

export async function subirConstancia(id, formData) {
  formData.append('id', id);

  const url = endpoints.pedidos.subirConstancia;

  return axiosFileServer()
    .post(url, formData)
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Archivo cargado',
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

export async function eliminarConstancia(id) {
  const url = endpoints.pedidos.eliminarConstancia;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Constancia eliminada',
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

export async function registrarPago(id, data) {
  const url = endpoints.pedidos.registrarPago;

  return axiosServer()
    .post(url, {
      id,
      ...data,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Pago registrado',
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

export async function eliminarPago(id) {
  const url = endpoints.pedidos.eliminarPago;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Pago eliminado',
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

export async function actualizarProductoTransito(id, enviados, entregados) {
  const url = endpoints.pedidos.actualizarProductoTransito;

  return axiosServer()
    .post(url, {
      id,
      enviados,
      entregados,
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

export async function actualizarRefaccionTransito(id, enviadas, entregadas) {
  const url = endpoints.pedidos.actualizarRefaccionTransito;

  return axiosServer()
    .post(url, {
      id,
      enviadas,
      entregadas,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Refacción actualizada',
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

export async function eliminarGuia(id) {
  const url = endpoints.pedidos.eliminarGuia;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Guía eliminada',
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

export async function registrarGuia(id, data) {
  const url = endpoints.pedidos.registrarGuia;

  return axiosServer()
    .post(url, {
      id,
      ...data,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Guía registrada',
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

export async function enviarGuia(id) {
  const url = endpoints.pedidos.enviarGuia;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Guía enviada',
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

export async function actualizarEstado(id, estado) {
  const url = endpoints.pedidos.actualizarEstado;

  return axiosServer()
    .post(url, {
      id,
      estado,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Estado actualizado',
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

export async function facturarPorAdelantado(id) {
  const url = endpoints.pedidos.facturarPorAdelantado;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Correo enviado a administración',
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

export async function pedidoPagado(id) {
  const url = endpoints.pedidos.pedidoPagado;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Correos enviado',
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

export async function reenviarPP(id) {
  const url = endpoints.pedidos.reenviarPP;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Correos reenviados',
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

export async function getPlantillasCorreosPedido(idPedido) {
  const url = `${endpoints.pedidos.getPlantillasCorreosPedido}?idPedido=${idPedido}`;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function enviarCorreoTransito(idPedido, asunto, para, copiaPara, mensaje, plantilla) {
  const url = endpoints.pedidos.enviarCorreoTransito;

  return axiosServer()
    .post(url, {
      idPedido,
      asunto,
      para,
      copiaPara,
      mensaje,
      plantilla,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Correo enviado',
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

export async function finalizarPedido(id) {
  const url = endpoints.pedidos.finalizarPedido;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Pedido finalizado',
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

export async function registrarPedido(id_cliente) {
  const url = endpoints.pedidos.registrarPedido;

  return axiosServer()
    .post(url, {
      id_cliente,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Pedido registrado',
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
            ? error.response.data.message
            : error || 'Algo salió mal!',
      };
      return message;
    });
}

export async function getTablaPagosPayPal(paginationModel, filterModel) {
  const url = endpoints.pedidos.getTablaPagosPayPal;

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

export async function capturePayPalPayment(id) {
  const url = endpoints.pedidos.capturePayPalPayment;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Pago capturado',
      };
      return message;
    })
    .catch((error) => {
      const message = {
        type: 'error',
        message: error.message
          ? error.message
          : error.response
            ? error.response.data.message
            : error || 'Algo salió mal!',
      };
      return message;
    });
}

export async function voidPayPalPayment(id) {
  const url = endpoints.pedidos.voidPayPalPayment;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Pago cancelado',
      };
      return message;
    })
    .catch((error) => {
      const message = {
        type: 'error',
        message: error.message
          ? error.message
          : error.response
            ? error.response.data.message
            : error || 'Algo salió mal!',
      };
      return message;
    });
}

export async function cancelarPedido(id) {
  const url = endpoints.pedidos.cancelarPedido;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Pedido cancelado',
      };
      return message;
    })
    .catch((error) => {
      const message = {
        type: 'error',
        message: error.response.data.message || 'Algo salió mal!',
      };
      return message;
    });
}
