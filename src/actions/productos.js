'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer, axiosFileServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getProductos(paginationModel, filterModel, filters) {
  const url = endpoints.productos.list;

  return axiosServer()
    .get(url, {
      params: {
        paginationModel,
        filterModel,
        filters,
      },
    })
    .then((res) => res.data)
    .catch((error) => {});
}

export async function getProducto(id) {
  const url = `${endpoints.productos.getProducto}?id=${id}`;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {});
}

export async function updateProducto(id, values) {
  const url = endpoints.productos.updateProducto;

  return axiosServer()
    .post(url, {
      id,
      values,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Producto actualizado',
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

export async function actualizarDescripcion(id, descripcion) {
  const url = endpoints.productos.actualizarDescripcion;

  return axiosServer()
    .post(url, {
      id,
      descripcion,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Descripción actualizada',
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

// ----------------------------------------------------------------------

export async function subirImagenPrincipal(id, formData) {
  formData.append('id', id);

  const url = endpoints.productos.subirImagenPrincipal;

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

export async function subirImagenCarrusel(id, formData) {
  formData.append('id', id);

  const url = endpoints.productos.subirImagenCarrusel;

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
  const url = endpoints.productos.eliminarImagenCarrusel;

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

// ----------------------------------------------------------------------

export async function actualizarFicha(idProducto, fichaTecnica, camposJson) {
  const url = endpoints.productos.actualizarFicha;

  return axiosServer()
    .post(url, {
      idProducto,
      fichaTecnica,
      camposJson,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Ficha actualizada',
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

// ----------------------------------------------------------------------

export async function aplicarPlantillaFicha(idProducto, idPlantilla) {
  const url = endpoints.productos.aplicarPlantillaFicha;

  return axiosServer()
    .post(url, {
      idProducto,
      idPlantilla,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Plantilla aplicada',
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

export async function getTablaProductosRelacionados(paginationModel, filterModel) {
  const url = endpoints.productos.getTablaProductosRelacionados;

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

export async function agregarProductoRelacionado(id_producto, id_relacionado) {
  const url = endpoints.productos.agregarProductoRelacionado;

  return axiosServer()
    .post(url, {
      id_producto,
      id_relacionado,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Producto relacionado agregado',
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

export async function agregarProductoSimilar(id_producto, id_similar) {
  const url = endpoints.productos.agregarProductoSimilar;

  return axiosServer()
    .post(url, {
      id_producto,
      id_similar,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Producto similar agregado',
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

export async function eliminarProductoRelacionado(id_relacionado) {
  const url = endpoints.productos.eliminarProductoRelacionado;

  return axiosServer()
    .post(url, {
      id_relacionado,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Producto relacionado eliminado',
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

export async function eliminarProductoSimilar(id_similar) {
  const url = endpoints.productos.eliminarProductoSimilar;

  return axiosServer()
    .post(url, {
      id_similar,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Producto similar eliminado',
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

export async function getTablaTipoCambio(paginationModel, filterModel) {
  const url = endpoints.productos.getTablaTipoCambio;

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

export async function aplicarTipoDeCambio(id, tipoDeCambio, tipoDeCambioOferta) {
  const url = endpoints.productos.aplicarTipoDeCambio;

  return axiosServer()
    .post(url, {
      id,
      tipoDeCambio,
      tipoDeCambioOferta,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Tipo de cambio aplicado',
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

export async function procesarMarcasTipoDeCambio() {
  const url = endpoints.productos.procesarMarcasTipoDeCambio;

  return axiosServer()
    .post(url)
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Marcas procesadas',
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
  const url = endpoints.productos.getMarcas;

  return axiosServer()
    .get(url)
    .then((res) => res.data)
    .catch((error) => {});
}

export async function getTipos(marca) {
  const url = endpoints.productos.getTipos;

  return axiosServer()
    .get(url, {
      params: {
        marca,
      },
    })
    .then((res) => res.data)
    .catch((error) => {});
}

export async function modificarOfertasMarca(marca, tipo, porcentaje) {
  const url = endpoints.productos.modificarOfertasMarca;

  return axiosServer()
    .post(url, {
      marca,
      tipo,
      porcentaje,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Ofertas aplicadas',
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

export async function modificarOfertasMarcaCotizacion(marca, tipo, porcentaje) {
  const url = endpoints.productos.modificarOfertasMarcaCotizacion;

  return axiosServer()
    .post(url, {
      marca,
      tipo,
      porcentaje,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Ofertas aplicadas',
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

export async function eliminarOfertasMarca(marca, tipo) {
  const url = endpoints.productos.eliminarOfertasMarca;

  return axiosServer()
    .post(url, {
      marca,
      tipo,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Ofertas eliminadas',
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

export async function eliminarOfertasMarcaCotizacion(marca, tipo) {
  const url = endpoints.productos.eliminarOfertasMarcaCotizacion;

  return axiosServer()
    .post(url, {
      marca,
      tipo,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Ofertas eliminadas',
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

export async function cargarExcel(formData) {
  const url = endpoints.productos.cargarExcel;

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

export async function getTablaPlantillas(paginationModel, filterModel) {
  const url = endpoints.productos.getTablaPlantillas;

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

export async function getPlantilla(id) {
  const url = endpoints.productos.getPlantilla;

  return axiosServer()
    .get(url, {
      params: {
        id,
      },
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

export async function editarCampoPlantilla(idPlantilla, nombre, id) {
  const url = endpoints.productos.editarCampoPlantilla;

  return axiosServer()
    .post(url, {
      idPlantilla,
      nombre,
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Campo actualizado',
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

export async function eliminarCampoPlantilla(idPlantilla, id) {
  const url = endpoints.productos.eliminarCampoPlantilla;

  return axiosServer()
    .post(url, {
      idPlantilla,
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Campo eliminado',
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

export async function registrarCampoPlantilla(id, nombre) {
  const url = endpoints.productos.registrarCampoPlantilla;

  return axiosServer()
    .post(url, {
      id,
      nombre,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Campo registrado',
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

export async function registrarPlantilla(nombre) {
  const url = endpoints.productos.registrarPlantilla;

  return axiosServer()
    .post(url, {
      nombre,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Plantilla registrada',
        id: res.data.id,
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

export async function eliminarPlantilla(id) {
  const url = endpoints.productos.eliminarPlantilla;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Plantilla eliminada',
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

export async function createProducto(values) {
  const url = endpoints.productos.createProducto;

  return axiosServer()
    .post(url, {
      values,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Producto creado',
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

export async function duplicarProducto(id) {
  const url = endpoints.productos.duplicarProducto;

  return axiosServer()
    .post(url, {
      id,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Producto duplicado',
      };
      const idNuevo = res.data.id;

      return { ...message, idNuevo };
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

export async function getRefaccionesRelacionadas(id) {
  const url = endpoints.productos.getRefaccionesRelacionadas;

  return axiosServer()
    .get(url, {
      params: {
        id,
      },
    })
    .then((res) => res.data)
    .catch((error) => {});
}

export async function getTablaAgregarRefaccionesRelacionadas(paginationModel, filterModel) {
  const url = endpoints.productos.getTablaAgregarRefaccionesRelacionadas;

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

export async function agregarRefaccionRelacionada(id_refaccion, id_producto) {
  const url = endpoints.productos.agregarRefaccionRelacionada;

  return axiosServer()
    .post(url, {
      id_refaccion,
      id_producto,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Agregada',
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

export async function eliminarRefaccionRelacionada(id_refaccion, id_producto) {
  const url = endpoints.productos.eliminarRefaccionRelacionada;

  return axiosServer()
    .post(url, {
      id_refaccion,
      id_producto,
    })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Eliminada',
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

// Ofertas temporales
export async function getOfertasTemporales(id) {
  const url = endpoints.productos.getOfertasTemporales;

  return axiosServer()
    .get(url, {
      params: {
        id,
      },
    })
    .then((res) => res.data)
    .catch((error) => {});
}

export async function getTodasLasOfertasTemporales(paginationModel, filterModel, sortModel = []) {
  const url = endpoints.productos.getTodasLasOfertasTemporales;

  return axiosServer()
    .get(url, {
      params: {
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        filter: JSON.stringify(filterModel),
        sort: JSON.stringify(sortModel),
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error('Error fetching ofertas temporales:', error);
      return { rows: [], totalRows: 0 };
    });
}

export async function crearOfertaTemporal(data) {
  const url = endpoints.productos.crearOfertaTemporal;

  return axiosServer()
    .post(url, data)
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Oferta temporal creada',
      };
      return message;
    })
    .catch((error) => {
      const message = {
        type: 'error',
        message: error.error || error.message || 'Algo salió mal!',
      };
      return message;
    });
}

export async function actualizarOfertaTemporal(id, data) {
  const url = endpoints.productos.actualizarOfertaTemporal;

  return axiosServer()
    .post(url, { id, ...data })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Oferta temporal actualizada',
      };
      return message;
    })
    .catch((error) => {
      const message = {
        type: 'error',
        message: error.error || error.message || 'Algo salió mal!',
      };
      return message;
    });
}

export async function eliminarOfertaTemporal(id) {
  const url = endpoints.productos.eliminarOfertaTemporal;

  return axiosServer()
    .post(url, { id })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Oferta temporal eliminada',
      };
      return message;
    })
    .catch((error) => {
      const message = {
        type: 'error',
        message: error.error || error.message || 'Algo salió mal!',
      };
      return message;
    });
}
