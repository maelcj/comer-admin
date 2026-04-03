'use client';

import axiosInstance from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getHistorialProductos(paginationModel, filterModel) {
  try {
    const response = await axiosInstance.post('/api/admin/auditorias/productos', {
      paginationModel,
      filterModel,
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener historial de productos:', error);
    throw error;
  }
}

export async function getDetalleAuditoria(id) {
  try {
    const response = await axiosInstance.get(`/api/admin/auditorias/productos/${id}`);

    return response.data;
  } catch (error) {
    console.error('Error al obtener detalle de auditoría:', error);
    throw error;
  }
}
