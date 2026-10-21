import { CONFIG } from 'src/config-global';

import { PreciosListView } from 'src/sections/precios/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Precios | ${CONFIG.site.name}` };

export default function Page() {
  return <PreciosListView />;
}
