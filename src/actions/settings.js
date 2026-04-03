'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

// ----------------------------------------------------------------------

export async function getSettings() {
  const url = endpoints.settings.getSettings;

  return axiosServer()
    .get(url)
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

export async function updateSettings(settings) {
  const url = endpoints.settings.updateSettings;

  return axiosServer()
    .post(url, { settings })
    .then((res) => {
      const message = {
        type: 'success',
        message: 'Actualizadas',
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
