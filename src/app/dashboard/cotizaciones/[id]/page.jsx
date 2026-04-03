import { CONFIG } from 'src/config-global';
import { getCotizacion } from 'src/actions/cotizaciones';

import { CotizacionEditView } from 'src/sections/cotizaciones/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Cotizacion | Dashboard - ${CONFIG.site.name}` };

export default async function Page({ params }) {
  const { id } = params;

  const { cotizacion } = await getCotizacion(id);

  return <CotizacionEditView cotizacionPrev={cotizacion} />;
}

// ----------------------------------------------------------------------
