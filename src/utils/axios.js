import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Algo salió mal!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    // console.log('fetcher url:', url);
    // console.log('fetcher config:', config);

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  app: {
    getSettings: '/api/admin/app/getSettings',
  },
  omnisearch: {
    buscarCotizaciones: '/api/admin/omnisearch/buscarCotizaciones',
    buscarPedidos: '/api/admin/omnisearch/buscarPedidos',
    buscarClientes: '/api/admin/omnisearch/buscarClientes',
  },
  index: {
    getGraficaPedidos: '/api/admin/index/getGraficaPedidos',
    getTotalPedidos: '/api/admin/index/getTotalPedidos',
  },
  estadisticas: {
    getTablaEstadisticas: '/api/admin/estadisticas/getTablaEstadisticas',
    getResumenEstadisticas: '/api/admin/estadisticas/getResumenEstadisticas',
    updatePublicidad: '/api/admin/estadisticas/updatePublicidad',
    ejecutarProductosMerchant: '/api/admin/estadisticas/ejecutarProductosMerchant',
  },
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/login',
    signUp: '/api/auth/sign-up',
    refreshToken: '/api/refresh-token',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  productos: {
    list: '/api/admin/productos/getTablaProductos',
    getProducto: '/api/admin/productos/getProducto',
    updateProducto: '/api/admin/productos/updateProducto',
    createProducto: '/api/admin/productos/createProducto',
    actualizarDescripcion: '/api/admin/productos/actualizarDescripcion',
    subirImagenPrincipal: '/api/admin/productos/subirImagenPrincipal',
    subirImagenCarrusel: '/api/admin/productos/subirImagenCarrusel',
    eliminarImagenCarrusel: '/api/admin/productos/eliminarImagenCarrusel',
    actualizarFicha: '/api/admin/productos/actualizarFicha',
    aplicarPlantillaFicha: '/api/admin/productos/aplicarPlantillaFicha',
    getTablaProductosRelacionados: '/api/admin/productos/getTablaProductosRelacionados',
    agregarProductoRelacionado: '/api/admin/productos/agregarProductoRelacionado',
    agregarProductoSimilar: '/api/admin/productos/agregarProductoSimilar',
    eliminarProductoRelacionado: '/api/admin/productos/eliminarProductoRelacionado',
    eliminarProductoSimilar: '/api/admin/productos/eliminarProductoSimilar',
    getTablaTipoCambio: '/api/admin/productos/getTablaTipoCambio',
    aplicarTipoDeCambio: '/api/admin/productos/aplicarTipoDeCambio',
    procesarMarcasTipoDeCambio: '/api/admin/productos/procesarMarcasTipoDeCambio',
    getMarcas: '/api/admin/productos/getMarcas',
    getTipos: '/api/admin/productos/getTipos',
    modificarOfertasMarca: '/api/admin/productos/modificarOfertasMarca',
    modificarOfertasMarcaCotizacion: '/api/admin/productos/modificarOfertasMarcaCotizacion',
    eliminarOfertasMarca: '/api/admin/productos/eliminarOfertasMarca',
    eliminarOfertasMarcaCotizacion: '/api/admin/productos/eliminarOfertasMarcaCotizacion',
    cargarExcel: '/api/admin/productos/cargarExcel',
    exportarExcel: '/api/admin/productos/exportarExcel',
    getTablaPlantillas: '/api/admin/productos/getTablaPlantillas',
    getPlantilla: '/api/admin/productos/getPlantilla',
    editarCampoPlantilla: '/api/admin/productos/editarCampoPlantilla',
    eliminarCampoPlantilla: '/api/admin/productos/eliminarCampoPlantilla',
    registrarCampoPlantilla: '/api/admin/productos/registrarCampoPlantilla',
    registrarPlantilla: '/api/admin/productos/registrarPlantilla',
    eliminarPlantilla: '/api/admin/productos/eliminarPlantilla',
    duplicarProducto: '/api/admin/productos/duplicarProducto',
    getRefaccionesRelacionadas: '/api/admin/productos/getRefaccionesRelacionadas',
    getTablaAgregarRefaccionesRelacionadas:
      '/api/admin/productos/getTablaAgregarRefaccionesRelacionadas',
    agregarRefaccionRelacionada: '/api/admin/productos/agregarRefaccionRelacionada',
    eliminarRefaccionRelacionada: '/api/admin/productos/eliminarRefaccionRelacionada',
    getOfertasTemporales: '/api/admin/productos/getOfertasTemporales',
    getTodasLasOfertasTemporales: '/api/admin/productos/getTodasLasOfertasTemporales',
    crearOfertaTemporal: '/api/admin/productos/crearOfertaTemporal',
    actualizarOfertaTemporal: '/api/admin/productos/actualizarOfertaTemporal',
    eliminarOfertaTemporal: '/api/admin/productos/eliminarOfertaTemporal',
  },
  refacciones: {
    list: '/api/admin/refacciones/getTablaRefacciones',
    getRefaccion: '/api/admin/refacciones/getRefaccion',
    updateRefaccion: '/api/admin/refacciones/updateRefaccion',
    createRefaccion: '/api/admin/refacciones/createRefaccion',
    cargarExcel: '/api/admin/refacciones/cargarExcel',
    eliminarProductoRelacionado: '/api/admin/refacciones/eliminarProductoRelacionado',
    getTablaAgregarProductosRelacionados:
      '/api/admin/refacciones/getTablaAgregarProductosRelacionados',
    agregarProductoRelacionado: '/api/admin/refacciones/agregarProductoRelacionado',
    getProductosRelacionados: '/api/admin/refacciones/getProductosRelacionados',
    subirImagenCarrusel: '/api/admin/refacciones/subirImagenCarrusel',
    subirImagenPrincipal: '/api/admin/refacciones/subirImagenPrincipal',
    eliminarImagenCarrusel: '/api/admin/refacciones/eliminarImagenCarrusel',
    getMarcas: '/api/admin/refacciones/getMarcas',
  },
  cotizaciones: {
    getCotizacion: '/api/admin/cotizaciones/getCotizacion',
    getTablaCotizaciones: '/api/admin/cotizaciones/getTablaCotizaciones',
    getTablaProductosCotizacion: '/api/admin/cotizaciones/getTablaProductosCotizacion',
    eliminarProductoCotizacion: '/api/admin/cotizaciones/eliminarProductoCotizacion',
    actualizarProductoCotizacion: '/api/admin/cotizaciones/actualizarProductoCotizacion',
    getTablaAgregarProductosCotizacion:
      '/api/admin/cotizaciones/getTablaAgregarProductosCotizacion',
    agregarProductoCotizacion: '/api/admin/cotizaciones/agregarProductoCotizacion',
    eliminarRefaccionCotizacion: '/api/admin/cotizaciones/eliminarRefaccionCotizacion',
    actualizarRefaccionCotizacion: '/api/admin/cotizaciones/actualizarRefaccionCotizacion',
    getTablaAgregarRefaccionesCotizacion:
      '/api/admin/cotizaciones/getTablaAgregarRefaccionesCotizacion',
    agregarRefaccionCotizacion: '/api/admin/cotizaciones/agregarRefaccionCotizacion',
    guardarEnvio: '/api/admin/cotizaciones/guardarEnvio',
    aplicarDescuento: '/api/admin/cotizaciones/aplicarDescuento',
    actualizarForzarIva: '/api/admin/cotizaciones/actualizarForzarIva',
    enviarCotizacion: '/api/admin/cotizaciones/enviarCotizacion',
    registrarCotizacion: '/api/admin/cotizaciones/registrarCotizacion',
    hacerPedido: '/api/admin/cotizaciones/hacerPedido',
  },
  pedidos: {
    getPedido: '/api/admin/pedidos/getPedido',
    getTablaPedidos: '/api/admin/pedidos/getTablaPedidos',
    getTablaProductosPedido: '/api/admin/pedidos/getTablaProductosPedido',
    eliminarProductoPedido: '/api/admin/pedidos/eliminarProductoPedido',
    actualizarProductoPedido: '/api/admin/pedidos/actualizarProductoPedido',
    getTablaAgregarProductosPedido: '/api/admin/pedidos/getTablaAgregarProductosPedido',
    agregarProductoPedido: '/api/admin/pedidos/agregarProductoPedido',
    eliminarRefaccionPedido: '/api/admin/pedidos/eliminarRefaccionPedido',
    actualizarRefaccionPedido: '/api/admin/pedidos/actualizarRefaccionPedido',
    getTablaAgregarRefaccionesPedido: '/api/admin/pedidos/getTablaAgregarRefaccionesPedido',
    agregarRefaccionPedido: '/api/admin/pedidos/agregarRefaccionPedido',
    guardarEnvio: '/api/admin/pedidos/guardarEnvio',
    aplicarDescuento: '/api/admin/pedidos/aplicarDescuento',
    actualizarForzarIva: '/api/admin/pedidos/actualizarForzarIva',
    guardarDatosEnvio: '/api/admin/pedidos/guardarDatosEnvio',
    getDatosEnvioCliente: '/api/admin/pedidos/getDatosEnvioCliente',
    subirFactura: '/api/admin/pedidos/subirFactura',
    enviarFactura: '/api/admin/pedidos/enviarFactura',
    eliminarFactura: '/api/admin/pedidos/eliminarFactura',
    guardarDatosFacturacion: '/api/admin/pedidos/guardarDatosFacturacion',
    getDatosFacturacionCliente: '/api/admin/pedidos/getDatosFacturacionCliente',
    subirConstancia: '/api/admin/pedidos/subirConstancia',
    eliminarConstancia: '/api/admin/pedidos/eliminarConstancia',
    registrarPago: '/api/admin/pedidos/registrarPago',
    eliminarPago: '/api/admin/pedidos/eliminarPago',
    actualizarProductoTransito: '/api/admin/pedidos/actualizarProductoTransito',
    actualizarRefaccionTransito: '/api/admin/pedidos/actualizarRefaccionTransito',
    eliminarGuia: '/api/admin/pedidos/eliminarGuia',
    registrarGuia: '/api/admin/pedidos/registrarGuia',
    enviarGuia: '/api/admin/pedidos/enviarGuia',
    actualizarEstado: '/api/admin/pedidos/actualizarEstado',
    facturarPorAdelantado: '/api/admin/pedidos/facturarPorAdelantado',
    pedidoPagado: '/api/admin/pedidos/pedidoPagado',
    reenviarPP: '/api/admin/pedidos/reenviarPP',
    getPlantillasCorreosPedido: '/api/admin/pedidos/getPlantillasCorreosPedido',
    enviarCorreoTransito: '/api/admin/pedidos/enviarCorreoTransito',
    finalizarPedido: '/api/admin/pedidos/finalizarPedido',
    registrarPedido: '/api/admin/pedidos/registrarPedido',
    getTablaPagosPayPal: '/api/admin/pedidos/getTablaPagosPayPal',
    capturePayPalPayment: '/api/admin/pedidos/capturePayPalPayment',
    voidPayPalPayment: '/api/admin/pedidos/voidPayPalPayment',
    cancelarPedido: '/api/admin/pedidos/cancelarPedido',
  },

  clientes: {
    list: '/api/admin/clientes/getTablaClientes',
    getCliente: '/api/admin/clientes/getCliente',
    updateCliente: '/api/admin/clientes/updateCliente',
    getTablaCotizaciones: '/api/admin/clientes/getTablaCotizaciones',
    getTablaPedidos: '/api/admin/clientes/getTablaPedidos',
    createCliente: '/api/admin/clientes/createCliente',
    getTablaPedidosPendientes: '/api/admin/clientes/getTablaPedidosPendientes',
    asignarPedidoPendiente: '/api/admin/clientes/asignarPedidoPendiente',
    eliminarPedidoPendiente: '/api/admin/clientes/eliminarPedidoPendiente',
  },

  usuarios: {
    list: '/api/admin/usuarios/getTablaUsuarios',
    getUsuario: '/api/admin/usuarios/getUsuario',
    createUsuario: '/api/admin/usuarios/createUsuario',
    updateUsuario: '/api/admin/usuarios/updateUsuario',
    deleteUsuario: '/api/admin/usuarios/deleteUsuario',
    assignRole: '/api/admin/usuarios/assignRole',
    getUserRole: '/api/admin/usuarios/getUserRole',
  },

  roles: {
    list: '/api/admin/roles/getTablaRoles',
    getAllRoles: '/api/admin/roles/getAllRoles',
    getRole: '/api/admin/roles/getRole',
    createRole: '/api/admin/roles/createRole',
    updateRole: '/api/admin/roles/updateRole',
    deleteRole: '/api/admin/roles/deleteRole',
  },

  categorias: {
    getCategorias: '/api/admin/categorias/getCategorias',
    getCategoriaNivel2: '/api/admin/categorias/getCategoriaNivel2',
    subirImagenCategoriaNivel2: '/api/admin/categorias/subirImagenCategoriaNivel2',
    subirImagenRefaccionesCategoriaNivel2:
      '/api/admin/categorias/subirImagenRefaccionesCategoriaNivel2',
    actualizarCategoriaNivel2: '/api/admin/categorias/actualizarCategoriaNivel2',
    actualizarCategoriaNivel3: '/api/admin/categorias/actualizarCategoriaNivel3',
    eliminarCategoriaNivel2: '/api/admin/categorias/eliminarCategoriaNivel2',
    eliminarCategoriaNivel3: '/api/admin/categorias/eliminarCategoriaNivel3',
    registrarCategoriaNivel2: '/api/admin/categorias/registrarCategoriaNivel2',
    registrarCategoriaNivel3: '/api/admin/categorias/registrarCategoriaNivel3',
    getCategoriaNivel3: '/api/admin/categorias/getCategoriaNivel3',
    getCategoriasPendientes: '/api/admin/categorias/getCategoriasPendientes',
    getCategoriasNivel1: '/api/admin/categorias/getCategoriasNivel1',
    registrarCategoriaPendiente: '/api/admin/categorias/registrarCategoriaPendiente',
    ejecutarCategoriasJob: '/api/admin/categorias/ejecutarCategoriasJob',
  },
  cupones: {
    getCupones: '/api/admin/cupones/getCupones',
    actualizarCupon: '/api/admin/cupones/actualizarCupon',
    eliminarCupon: '/api/admin/cupones/eliminarCupon',
    registrarCupon: '/api/admin/cupones/registrarCupon',
  },
  comentarios: {
    getComentarios: '/api/admin/comentarios/getComentarios',
    actualizarComentario: '/api/admin/comentarios/actualizarComentario',
    eliminarComentario: '/api/admin/comentarios/eliminarComentario',
    enviarComentario: '/api/admin/comentarios/enviarComentario',
    getProductos: '/api/admin/comentarios/getProductos',
    crearComentario: '/api/admin/comentarios/crearComentario',
  },
  carritos: {
    list: '/api/admin/carritos/getTablaCarritos',
    getCarrito: '/api/admin/carritos/getCarrito',
    createCarrito: '/api/admin/carritos/createCarrito',
    updateCarrito: '/api/admin/carritos/updateCarrito',
    deleteCarrito: '/api/admin/carritos/deleteCarrito',
    getTablaAgregarProductosCarrito: '/api/admin/carritos/getTablaAgregarProductosCarrito',
    getTablaAgregarRefaccionesCarrito: '/api/admin/carritos/getTablaAgregarRefaccionesCarrito',
    agregarProductoCarrito: '/api/admin/carritos/agregarProductoCarrito',
    agregarRefaccionCarrito: '/api/admin/carritos/agregarRefaccionCarrito',
    eliminarProductoCarrito: '/api/admin/carritos/eliminarProductoCarrito',
    eliminarRefaccionCarrito: '/api/admin/carritos/eliminarRefaccionCarrito',
    actualizarProductoCarrito: '/api/admin/carritos/actualizarProductoCarrito',
    actualizarRefaccionCarrito: '/api/admin/carritos/actualizarRefaccionCarrito',
    guardarDatosEnvioCarrito: '/api/admin/carritos/guardarDatosEnvioCarrito',
    guardarDatosFacturacionCarrito: '/api/admin/carritos/guardarDatosFacturacionCarrito',
  },
  settings: {
    getSettings: '/api/admin/settings/getSettings',
    updateSettings: '/api/admin/settings/updateSettings',
  },
  google: {
    list: '/api/admin/google/getTablaGoogleProductCategories',
    getGoogleProductCategory: '/api/admin/google/getGoogleProductCategory',
    createGoogleProductCategory: '/api/admin/google/createGoogleProductCategory',
    updateGoogleProductCategory: '/api/admin/google/updateGoogleProductCategory',
    deleteGoogleProductCategory: '/api/admin/google/deleteGoogleProductCategory',
    getTiposProductos: '/api/admin/productos/getTablaTiposProductos',
    updateTipoProducto: '/api/admin/productos/updateTipoProducto',
  },
};
