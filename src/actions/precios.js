'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getTablaPrecios(paginationModel, filterModel, filters) {
  const url = endpoints.precios.getTablaPrecios;

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

export async function importarMatches(matches) {
  const endpoint = endpoints.precios.importarMatches;

  return axiosServer()
    .post(endpoint, {
      matches,
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error importando matches:', error);
      const message = error?.response?.data?.message || 'Error al importar registros';
      return { success: false, message, created: 0, skipped: 0, errors: [message] };
    });
}

export async function exportarJson(product_ids) {
  const endpoint = endpoints.precios.exportarJson;

  return axiosServer()
    .post(endpoint, {
      product_ids,
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error exportando json:', error);
      return { products: [] };
    });
}
