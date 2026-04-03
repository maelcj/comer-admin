import { CONFIG } from 'src/config-global';
import { getCarrito } from 'src/actions/carritos';

import { CarritoEditView } from 'src/sections/carritos/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Editar carrito | ${CONFIG.site.name}` };

export default async function Page({ params }) {
  const { id } = params;

  const carritoPrev = await getCarrito(id);

  return <CarritoEditView carritoPrev={carritoPrev} />;
}
