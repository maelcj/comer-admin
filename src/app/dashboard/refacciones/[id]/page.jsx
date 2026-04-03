import { CONFIG } from 'src/config-global';
import { getRefaccion } from 'src/actions/refacciones';

import { RefaccionEditView } from 'src/sections/refacciones/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Editar refacción | Dashboard - ${CONFIG.site.name}` };

export default async function Page({ params }) {
  const { id } = params;

  const res = await getRefaccion(id);

  return <RefaccionEditView refaccionPrev={res} />;
}

// ----------------------------------------------------------------------
