'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getUsuarios(paginationModel, search, searchType) {
  const url = endpoints.usuarios.list;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        search,
        searchType,
      },
    })
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function getUsuario(id) {
  const url = endpoints.usuarios.getUsuario;

  return axiosServer()
    .get(url, {
      params: {
        id,
      },
    })
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function createUsuario(data) {
  const url = endpoints.usuarios.createUsuario;

  return axiosServer()
    .post(url, data)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}

export async function updateUsuario(id, data) {
  const url = endpoints.usuarios.updateUsuario;

  return axiosServer()
    .post(url, { id, ...data })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}

export async function deleteUsuario(id) {
  const url = endpoints.usuarios.deleteUsuario;

  return axiosServer()
    .post(url, { id })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}
