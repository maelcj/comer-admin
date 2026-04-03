import { CONFIG } from 'src/config-global';
import { getMarcas } from 'src/actions/refacciones';

import { RefaccionCreateView } from 'src/sections/refacciones/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Registrar refacción | ${CONFIG.site.name}` };

export default async function Page() {
  const marcas = await getMarcas();

  return <RefaccionCreateView marcas={marcas} />;
}
