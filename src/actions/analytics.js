'use server';

import { endpoints } from 'src/utils/axios';
import { axiosServer } from 'src/utils/axiosInterceptor';

export async function getAnalyticsRealtime() {
  const url = endpoints.index.analyticsRealtime;

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
