'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer, axiosFileServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getRefacciones(paginationModel, filterModel, sortModel) {
  const url = endpoints.refacciones.list;

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

export async function getRefaccion(id) {
  const url = `${endpoints.refacciones.getRefaccion}?id=${id}`;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {});
}

export async function updateRefaccion(id, values) {
  const url = endpoints.refacciones.updateRefaccion;

  return axiosServer()
    .post(url, {
      id,
      values,
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

export async function createRefaccion(values) {
  const url = endpoints.refacciones.createRefaccion;

  return axiosServer()
    .post(url, {
      values,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Refacción creada',
      };
      const { id } = res.data;

      return { ...message, id };
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

export async function cargarExcel(formData) {
  const url = endpoints.refacciones.cargarExcel;

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

export async function eliminarProductoRelacionado(id_producto, id_refaccion) {
  const url = endpoints.refacciones.eliminarProductoRelacionado;

  return axiosServer()
    .post(url, {
      id_producto,
      id_refaccion,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Eliminado',
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

export async function getTablaAgregarProductosRelacionados(paginationModel, filterModel) {
  const url = endpoints.refacciones.getTablaAgregarProductosRelacionados;

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

export async function agregarProductoRelacionado(id_producto, id_refaccion) {
  const url = endpoints.refacciones.agregarProductoRelacionado;

  return axiosServer()
    .post(url, {
      id_producto,
      id_refaccion,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Agregado',
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

export async function getProductosRelacionados(id) {
  const url = endpoints.refacciones.getProductosRelacionados;

  return axiosServer()
    .get(url, {
      params: {
        id,
      },
    })
    .then((res) => res.data)
    .catch((error) => {});
}

export async function subirImagenCarrusel(id, formData) {
  formData.append('id', id);

  const url = endpoints.refacciones.subirImagenCarrusel;

  return axiosFileServer()
    .post(url, formData)
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Imagen subida',
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

export async function subirImagenPrincipal(id, formData) {
  formData.append('id', id);

  const url = endpoints.refacciones.subirImagenPrincipal;

  return axiosFileServer()
    .post(url, formData)
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Imagen subida',
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

export async function eliminarImagenCarrusel(id) {
  const url = endpoints.refacciones.eliminarImagenCarrusel;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Imagen eliminada',
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

export async function getMarcas() {
  const url = endpoints.refacciones.getMarcas;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {});
}
