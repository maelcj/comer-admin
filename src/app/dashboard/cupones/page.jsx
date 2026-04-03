import { CONFIG } from 'src/config-global';

import { CuponesView } from 'src/sections/cupones/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Cupones | ${CONFIG.site.name}` };

export default function Page() {
  return <CuponesView />;
}
