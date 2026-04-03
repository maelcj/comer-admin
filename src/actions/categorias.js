'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer, axiosFileServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getCategorias(search) {
  const url = endpoints.categorias.getCategorias;

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

export async function getCategoriaNivel2(id) {
  const url = `${endpoints.categorias.getCategoriaNivel2}?id=${id}`;

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

export async function getCategoriaNivel3(id) {
  const url = `${endpoints.categorias.getCategoriaNivel3}?id=${id}`;

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

export async function subirImagenCategoriaNivel2(id, formData) {
  formData.append('id', id);

  const url = endpoints.categorias.subirImagenCategoriaNivel2;

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

export async function subirImagenRefaccionesCategoriaNivel2(id, formData) {
  formData.append('id', id);

  const url = endpoints.categorias.subirImagenRefaccionesCategoriaNivel2;

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

export async function actualizarCategoriaNivel2(id, nombre, singular) {
  const url = endpoints.categorias.actualizarCategoriaNivel2;

  return axiosServer()
    .post(url, {
      id,
      nombre,
      singular,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Categoría actualizada',
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

export async function actualizarCategoriaNivel3(id, nombre, singular, independiente) {
  const url = endpoints.categorias.actualizarCategoriaNivel3;

  return axiosServer()
    .post(url, {
      id,
      nombre,
      singular,
      independiente,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Categoría actualizada',
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

export async function eliminarCategoriaNivel2(id) {
  const url = endpoints.categorias.eliminarCategoriaNivel2;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Categoría eliminada',
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

export async function eliminarCategoriaNivel3(id) {
  const url = endpoints.categorias.eliminarCategoriaNivel3;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Categoría eliminada',
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

export async function registrarCategoriaNivel2(idCategoriasNivel1, nombre) {
  const url = endpoints.categorias.registrarCategoriaNivel2;

  return axiosServer()
    .post(url, {
      idCategoriasNivel1,
      nombre,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Categoría registrada',
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

export async function registrarCategoriaNivel3(idCategoriasNivel2, nombre) {
  const url = endpoints.categorias.registrarCategoriaNivel3;

  return axiosServer()
    .post(url, {
      idCategoriasNivel2,
      nombre,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Categoría registrada',
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

export async function getCategoriasPendientes() {
  const url = endpoints.categorias.getCategoriasPendientes;

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

export async function getCategoriasNivel1() {
  const url = endpoints.categorias.getCategoriasNivel1;

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

export async function registrarCategoriaPendiente(idCategoriaPendiente, idCategoriasNivel1) {
  const url = endpoints.categorias.registrarCategoriaPendiente;

  return axiosServer()
    .post(url, {
      idCategoriaPendiente,
      idCategoriasNivel1,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Categoría registrada',
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

export async function ejecutarCategoriasJob() {
  const url = endpoints.categorias.ejecutarCategoriasJob;

  return axiosServer()
    .post(url)
    .then((res) => {
      const message = {
        type: 'success',
        message: res.data.message || 'Job ejecutado correctamente',
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
