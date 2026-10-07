'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer, axiosFileServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getCategorias(search) {
  const url = endpoints.categorias.getCategorias;

  return axiosServer()
    .post(url, { search })
    .then((res) => res.data)
    .catch((error) => ({
      type: 'error',
      message: error.message || error.response || error || 'Algo salió mal!',
    }));
}

export async function getSubcategorias(parent_id = null) {
  const url = endpoints.categorias.getSubcategorias;

  return axiosServer()
    .post(url, { parent_id })
    .then((res) => res.data)
    .catch((error) => ({
      type: 'error',
      message: error.message || error.response || error || 'Algo salió mal!',
    }));
}

export async function getCategoria(id) {
  const url = `${endpoints.categorias.getCategoria}?id=${id}`;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => ({
      type: 'error',
      message: error.message || error.response || error || 'Algo salió mal!',
    }));
}

export async function actualizarCategoria(id, nombre, filter_brands) {
  const url = endpoints.categorias.actualizarCategoria;

  return axiosServer()
    .post(url, { id, nombre, filter_brands })
    .then((res) => ({
      type: 'success',
      message: 'Categoría actualizada',
    }))
    .catch((error) => ({
      type: 'error',
      message: error.message || error.response || error || 'Algo salió mal!',
    }));
}

export async function eliminarCategoria(id) {
  const url = endpoints.categorias.eliminarCategoria;

  return axiosServer()
    .post(url, { id })
    .then((res) => ({
      type: 'success',
      message: 'Categoría eliminada',
    }))
    .catch((error) => ({
      type: 'error',
      message: error.response?.data || error.message || 'Algo salió mal!',
    }));
}

export async function registrarCategoria(parent_id, nombre) {
  const url = endpoints.categorias.registrarCategoria;

  return axiosServer()
    .post(url, { parent_id, nombre })
    .then((res) => ({
      type: 'success',
      message: 'Categoría registrada',
    }))
    .catch((error) => ({
      type: 'error',
      message: error.message || error.response || error || 'Algo salió mal!',
    }));
}

export async function getCategoriasNivel1() {
  const url = endpoints.categorias.getCategoriasNivel1;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => ({
      type: 'error',
      message: error.message || error.response || error || 'Algo salió mal!',
    }));
}
