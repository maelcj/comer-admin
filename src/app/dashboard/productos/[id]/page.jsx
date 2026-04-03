import { CONFIG } from 'src/config-global';
import { getProducto } from 'src/actions/productos';

import { ProductoEditView } from 'src/sections/productos/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Product edit | Dashboard - ${CONFIG.site.name}` };

export default async function Page({ params }) {
  const { id } = params;

  const { producto, plantillas } = await getProducto(id);

  return <ProductoEditView productoPrev={producto} plantillasPrev={plantillas} />;
}

// ----------------------------------------------------------------------
