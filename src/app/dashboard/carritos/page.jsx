import { CONFIG } from 'src/config-global';

import { CarritosListView } from 'src/sections/carritos/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Carritos | ${CONFIG.site.name}` };

export default function Page() {
  return <CarritosListView />;
}
