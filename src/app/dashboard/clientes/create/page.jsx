import { CONFIG } from 'src/config-global';

import { ClienteCreateView } from 'src/sections/clientes/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Registrar cliente | Dashboard - ${CONFIG.site.name}` };

export default async function Page() {
  return <ClienteCreateView />;
}

// ----------------------------------------------------------------------
