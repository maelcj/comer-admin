import axios from 'src/utils/axios';

export const getCategoriasSeo = async (paginationModel, filters) => {
  try {
    const { page, pageSize } = paginationModel;
    const body = { page: page + 1, pageSize };
    if (filters) {
      if (filters.name) body.name = filters.name;
      if (filters.filter_no_title) body.filter_no_title = filters.filter_no_title;
      if (filters.filter_no_meta_title) body.filter_no_meta_title = filters.filter_no_meta_title;
      if (filters.filter_no_description) body.filter_no_description = filters.filter_no_description;
      if (filters.filter_no_meta_description)
        body.filter_no_meta_description = filters.filter_no_meta_description;
      if (filters.filter_no_image) body.filter_no_image = filters.filter_no_image;
    }

    const res = await axios.post('/api/admin/categorias/getCategoriasSeo', body);

    return res.data;
  } catch (error) {
    return { type: 'error', message: error.message };
  }
};

export const getCategoriaSeo = async (id) => {
  try {
    const res = await axios.get('/api/admin/categorias/getCategoriaSeo', { params: { id } });
    return res.data;
  } catch (error) {
    return { type: 'error', message: error.message };
  }
};

export const actualizarCategoriaSeo = async (id, data) => {
  try {
    const res = await axios.post('/api/admin/categorias/actualizarCategoriaSeo', {
      id,
      ...data,
    });
    return { type: 'success', message: res.data.message };
  } catch (error) {
    return { type: 'error', message: error.message };
  }
};

export const subirImagenCategoriaSeo = async (id, formData) => {
  try {
    const res = await axios.post(
      `/api/admin/categorias/subirImagenCategoriaSeo?id=${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return { type: 'success', message: res.data.message };
  } catch (error) {
    return { type: 'error', message: error.message };
  }
};
