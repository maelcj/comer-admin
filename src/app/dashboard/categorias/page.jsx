import { CONFIG } from 'src/config-global';

import { CategoriasView } from 'src/sections/categorias/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Categorías | ${CONFIG.site.name}` };

export default function Page() {
  return <CategoriasView />;
}
