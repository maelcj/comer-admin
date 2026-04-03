import { CONFIG } from 'src/config-global';

import { GoogleListView } from 'src/sections/google/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Google Product Categories | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <GoogleListView />;
}
