import { CONFIG } from 'src/config-global';

import { PosListView } from 'src/sections/pos/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Pos | ${CONFIG.site.name}` };

export default function Page() {
  return <PosListView />;
}
