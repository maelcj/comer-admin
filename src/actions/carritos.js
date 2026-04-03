'use server';

import axios from 'axios';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getCarritos(paginationModel, filterModel, sortModel) {
  const url = endpoints.carritos.list;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        filterModel,
        sortModel,
      },
    })
    .then((res) => res.data)
    .catch((error) => {});
}

export async function getCarrito(id) {
  const url = `${endpoints.carritos.getCarrito}?id=${id}`;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {});
}

export async function createCarrito() {
  const url = endpoints.carritos.createCarrito;

  return axiosServer()
    .post(url)
    .then((res) => res.data)
    .catch((error) => ({ type: 'error', message: 'Error al crear carrito' }));
}

export async function updateCarrito(id, data) {
  const url = endpoints.carritos.updateCarrito;

  return axiosServer()
    .post(url, { id, ...data })
    .then((res) => ({ type: 'success', message: res.data.message }))
    .catch((error) => ({ type: 'error', message: 'Error al actualizar carrito' }));
}

export async function deleteCarrito(id) {
  const url = endpoints.carritos.deleteCarrito;

  return axiosServer()
    .post(url, { id })
    .then((res) => ({ type: 'success', message: res.data.message }))
    .catch((error) => ({ type: 'error', message: 'Error al eliminar carrito' }));
}

export async function getTablaProductosCarrito(paginationModel, filterModel) {
  const url = endpoints.carritos.getTablaAgregarProductosCarrito;

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

export async function getTablaRefaccionesCarrito(paginationModel, filterModel) {
  const url = endpoints.carritos.getTablaAgregarRefaccionesCarrito;

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

export async function agregarProductoCarrito(id, id_producto) {
  const url = endpoints.carritos.agregarProductoCarrito;

  return axiosServer()
    .post(url, { id, id_producto })
    .then((res) => ({ type: 'success', message: res.data.message }))
    .catch((error) => ({ type: 'error', message: 'Error al agregar producto' }));
}

export async function agregarRefaccionCarrito(id, id_refaccion) {
  const url = endpoints.carritos.agregarRefaccionCarrito;

  return axiosServer()
    .post(url, { id, id_refaccion })
    .then((res) => ({ type: 'success', message: res.data.message }))
    .catch((error) => ({ type: 'error', message: 'Error al agregar refacción' }));
}

export async function eliminarProductoCarrito(id) {
  const url = endpoints.carritos.eliminarProductoCarrito;

  return axiosServer()
    .post(url, { id })
    .then((res) => ({ type: 'success', message: res.data.message }))
    .catch((error) => ({ type: 'error', message: 'Error al eliminar producto' }));
}

export async function eliminarRefaccionCarrito(id) {
  const url = endpoints.carritos.eliminarRefaccionCarrito;

  return axiosServer()
    .post(url, { id })
    .then((res) => ({ type: 'success', message: res.data.message }))
    .catch((error) => ({ type: 'error', message: 'Error al eliminar refacción' }));
}

export async function actualizarProductoCarrito(id, precio, cantidad) {
  const url = endpoints.carritos.actualizarProductoCarrito;

  return axiosServer()
    .post(url, { id, precio, cantidad })
    .then((res) => ({ type: 'success', message: res.data.message }))
    .catch((error) => ({ type: 'error', message: 'Error al actualizar producto' }));
}

export async function actualizarRefaccionCarrito(id, precio, cantidad) {
  const url = endpoints.carritos.actualizarRefaccionCarrito;

  return axiosServer()
    .post(url, { id, precio, cantidad })
    .then((res) => ({ type: 'success', message: res.data.message }))
    .catch((error) => ({ type: 'error', message: 'Error al actualizar refacción' }));
}

export async function guardarDatosEnvioCarrito(id, datos) {
  const url = endpoints.carritos.guardarDatosEnvioCarrito;

  return axiosServer()
    .post(url, { id, ...datos })
    .then((res) => ({ type: 'success', message: res.data.message }))
    .catch((error) => ({ type: 'error', message: 'Error al guardar datos de envío' }));
}

export async function guardarDatosFacturacionCarrito(id, datos) {
  const url = endpoints.carritos.guardarDatosFacturacionCarrito;

  return axiosServer()
    .post(url, { id, ...datos })
    .then((res) => ({ type: 'success', message: res.data.message }))
    .catch((error) => ({ type: 'error', message: 'Error al guardar datos de facturación' }));
}

export async function testApiCarrito(id) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/carrito/?id=${id}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        error: `HTTP ${error.response.status}`,
        data: error.response.data,
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/carrito/?id=${id}`,
      };
    }
    throw error;
  }
}
