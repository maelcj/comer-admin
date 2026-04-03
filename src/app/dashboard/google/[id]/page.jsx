import { CONFIG } from 'src/config-global';

import { GoogleEditView } from 'src/sections/google/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Editar Categoría Google | Dashboard - ${CONFIG.site.name}` };

export default function Page({ params }) {
  const { id } = params;

  return <GoogleEditView id={id} />;
}
