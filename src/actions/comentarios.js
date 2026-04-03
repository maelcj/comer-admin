'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getComentarios(page) {
  const url = endpoints.comentarios.getComentarios;

  return axiosServer()
    .get(url, { params: { page } })
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

export async function actualizarComentario(id, content, respuesta, calificacion, review) {
  const url = endpoints.comentarios.actualizarComentario;

  return axiosServer()
    .post(url, { id, content, respuesta, calificacion, review })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Comentario actualizado',
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

export async function eliminarComentario(id) {
  const url = endpoints.comentarios.eliminarComentario;

  return axiosServer()
    .post(url, { id })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Comentario eliminado',
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

export async function enviarComentario(id) {
  const url = endpoints.comentarios.enviarComentario;

  return axiosServer()
    .post(url, { id })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Comentario enviado al correo',
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

export async function getProductos(search, page) {
  const url = endpoints.comentarios.getProductos;

  return axiosServer()
    .get(url, { params: { search, page } })
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

export async function crearComentario(comentarioData) {
  const url = endpoints.comentarios.crearComentario;

  return axiosServer()
    .post(url, comentarioData)
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Comentario creado exitosamente',
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
