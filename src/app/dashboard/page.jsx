import { CONFIG } from 'src/config-global';

import { IndexView } from 'src/sections/index/view/index-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <IndexView />;
}
