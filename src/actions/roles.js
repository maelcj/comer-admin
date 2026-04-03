'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getRoles(paginationModel, search) {
  const url = endpoints.roles.list;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        search,
      },
    })
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function getAllRoles() {
  const url = endpoints.roles.getAllRoles;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function getRole(id) {
  const url = endpoints.roles.getRole;

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

export async function createRole(data) {
  const url = endpoints.roles.createRole;

  return axiosServer()
    .post(url, data)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}

export async function updateRole(id, data) {
  const url = endpoints.roles.updateRole;

  return axiosServer()
    .post(url, { id, ...data })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}

export async function deleteRole(id) {
  const url = endpoints.roles.deleteRole;

  return axiosServer()
    .post(url, { id })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}

export async function assignRole(userId, roleId) {
  const url = endpoints.usuarios.assignRole;

  return axiosServer()
    .post(url, { user_id: userId, role_id: roleId })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
}

export async function getUserRole(userId) {
  const url = endpoints.usuarios.getUserRole;

  return axiosServer()
    .get(url, {
      params: {
        user_id: userId,
      },
    })
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}
