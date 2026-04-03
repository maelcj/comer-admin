import { CONFIG } from 'src/config-global';

import { RefaccionesListView } from 'src/sections/refacciones/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Refacciones | ${CONFIG.site.name}` };

export default function Page() {
  return <RefaccionesListView />;
}
