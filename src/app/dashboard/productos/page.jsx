import { CONFIG } from 'src/config-global';

import { ProductosListView } from 'src/sections/productos/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Productos | ${CONFIG.site.name}` };

export default function Page() {
  return <ProductosListView />;
}
