'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getClientes(paginationModel, search, searchType) {
  const url = endpoints.clientes.list;

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

export async function getCliente(id) {
  const url = endpoints.clientes.getCliente;

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

export async function updateCliente(id, values) {
  const url = endpoints.clientes.updateCliente;

  return axiosServer()
    .post(url, {
      id,
      values,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Cliente actualizado',
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

export async function createCliente(values) {
  const url = endpoints.clientes.createCliente;

  return axiosServer()
    .post(url, {
      values,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Cliente creado',
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
            ? error
            : error || 'Algo salió mal!',
      };
      return message;
    });
}

export async function getTablaCotizaciones(idCliente, paginationModel, filterModel) {
  const url = endpoints.clientes.getTablaCotizaciones;

  return axiosServer()
    .get(url, {
      params: {
        idCliente,
        paginationModel,
        filterModel,
      },
    })
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function getTablaPedidos(idCliente, paginationModel, filterModel) {
  const url = endpoints.clientes.getTablaPedidos;

  return axiosServer()
    .get(url, {
      params: {
        idCliente,
        paginationModel,
        filterModel,
      },
    })
    .then((res) => res.data)
    .catch((error) => {})
    .finally(() => {});
}

export async function getTablaPedidosPendientes(paginationModel, search, searchType) {
  const url = endpoints.clientes.getTablaPedidosPendientes;

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

export async function asignarPedidoPendiente(idPedido, idCliente) {
  const url = endpoints.clientes.asignarPedidoPendiente;

  return axiosServer()
    .post(url, {
      idPedido,
      idCliente,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Pedido asignado',
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

export async function eliminarPedidoPendiente(idPedido) {
  const url = endpoints.clientes.eliminarPedidoPendiente;

  return axiosServer()
    .post(url, {
      idPedido,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Pedido eliminado',
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
