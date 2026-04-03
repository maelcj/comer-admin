import { CONFIG } from 'src/config-global';

import { GoogleCreateView } from 'src/sections/google/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Crear Categoría Google | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <GoogleCreateView />;
}
