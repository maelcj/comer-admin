import 'dayjs/locale/es-mx';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import TablaCotizaciones from '../cotizaciones/cotizaciones-tabla';

const IndexCotizaciones = () => (
  <Card sx={{ mt: 2 }}>
    <CardHeader title="Cotizaciones" sx={{ p: 2 }} />
    <TablaCotizaciones />
  </Card>
);

export default IndexCotizaciones;
