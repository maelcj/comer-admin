'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getGoogleProductCategories(paginationModel, filterModel, sortModel) {
  const url = endpoints.google.list;

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

export async function getGoogleProductCategory(id) {
  const url = `${endpoints.google.getGoogleProductCategory}?id=${id}`;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {});
}

export async function updateGoogleProductCategory(id, values) {
  const url = endpoints.google.updateGoogleProductCategory;

  return axiosServer()
    .post(url, {
      id,
      values,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Categoría de Google actualizada',
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

export async function createGoogleProductCategory(values) {
  const url = endpoints.google.createGoogleProductCategory;

  return axiosServer()
    .post(url, {
      values,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Categoría de Google creada',
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

export async function deleteGoogleProductCategory(id) {
  const url = endpoints.google.deleteGoogleProductCategory;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Categoría de Google eliminada',
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

export async function getTiposProductos(paginationModel, filterModel) {
  const url = endpoints.google.getTiposProductos;

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

export async function updateTipoProducto(id, googleProductCategoryId) {
  const url = endpoints.google.updateTipoProducto;

  return axiosServer()
    .post(url, {
      id,
      google_product_category_id: googleProductCategoryId,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Tipo de producto actualizado',
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
