'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getTablaPrecios(paginationModel, filterModel, filters, sortModel) {
  const url = endpoints.precios.getTablaPrecios;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        filterModel,
        filters,
        sortModel,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error fetching tabla precios:', error);
      return { rows: [], totalRows: 0, pageCount: 0 };
    });
}

export async function getResumenPrecios(filters) {
  const url = endpoints.precios.getResumenPrecios;

  return axiosServer()
    .get(url, {
      params: {
        filters,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error fetching resumen precios:', error);
      return {
        total_products: 0,
        total_comparable: 0,
        count_below: 0,
        count_above: 0,
        count_equal: 0,
        pct_below: 0,
        pct_above: 0,
        avg_pct_above: 0,
        avg_pct_below: 0,
      };
    });
}

export async function getTablaAlertasTiendas(paginationModel, filterModel, filters, sortModel) {
  const url = endpoints.precios.getTablaAlertasTiendas;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        filterModel,
        filters,
        sortModel,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error fetching tabla alertas tiendas:', error);
      return { rows: [], totalRows: 0, pageCount: 0 };
    });
}

export async function getTablaCompetidores(paginationModel, filterModel, filters) {
  const url = endpoints.precios.getTablaCompetidores;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        filterModel,
        filters,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error fetching tabla competidores:', error);
      return { rows: [], totalRows: 0, pageCount: 0 };
    });
}

export async function agregarCompetidorUrl(monitored_product_id, urls) {
  const endpoint = endpoints.precios.agregarCompetidorUrl;

  const payload = {
    monitored_product_id,
    urls: Array.isArray(urls) ? urls : [urls],
    url: typeof urls === 'string' ? urls : Array.isArray(urls) ? urls.join('\n') : '',
  };

  return axiosServer()
    .post(endpoint, payload)
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error agregando competidor url:', error);
      const message = error?.response?.data?.message || 'Error al registrar las URLs';
      return { success: false, message };
    });
}

export async function eliminarCompetidorUrl(id) {
  const endpoint = endpoints.precios.eliminarCompetidorUrl;

  return axiosServer()
    .post(endpoint, {
      id,
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error eliminando competidor url:', error);
      const message = error?.response?.data?.message || 'Error al eliminar la URL';
      return { success: false, message };
    });
}

export async function getTablaCompetidoresExcluidos(paginationModel, filterModel, filters) {
  const url = endpoints.precios.getTablaCompetidoresExcluidos;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        filterModel,
        filters,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error fetching tabla competidores excluidos:', error);
      return { rows: [], totalRows: 0, pageCount: 0 };
    });
}

export async function actualizarComentarioProducto(monitored_product_id, comments) {
  const endpoint = endpoints.precios.actualizarComentarioProducto;

  return axiosServer()
    .post(endpoint, {
      monitored_product_id,
      comments: comments ?? '',
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error actualizando comentario del producto:', error);
      const message = error?.response?.data?.message || 'Error al guardar el comentario';
      return { success: false, message };
    });
}

export async function actualizarExcluidoProducto(monitored_product_id, excluded, comments) {
  const endpoint = endpoints.precios.actualizarExcluidoProducto;

  const payload = {
    monitored_product_id,
    excluded: Boolean(excluded),
  };

  if (comments !== undefined) {
    payload.comments = comments ?? '';
  }

  return axiosServer()
    .post(endpoint, payload)
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error actualizando estado excluido del producto:', error);
      const message =
        error?.message ||
        error?.response?.data?.message ||
        'Error al actualizar el estado del producto';
      return { success: false, message };
    });
}

export async function sincronizarProductosPrecios() {
  const endpoint = endpoints.precios.sincronizarProductos;

  return axiosServer()
    .post(endpoint, {}, { timeout: 180000 })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error ejecutando sincronización de productos monitoreados:', error);
      const message =
        error?.message ||
        error?.response?.data?.message ||
        (typeof error === 'string' ? error : 'Error al sincronizar los productos de la tienda');
      return {
        success: false,
        already_running: Boolean(error?.already_running),
        message,
      };
    });
}
