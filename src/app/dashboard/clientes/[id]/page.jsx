import { CONFIG } from 'src/config-global';
import { getCliente } from 'src/actions/clientes';

import { ClienteEditView } from 'src/sections/clientes/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Editar cliente | Dashboard - ${CONFIG.site.name}` };

export default async function Page({ params }) {
  const { id } = params;

  const cliente = await getCliente(id);

  return <ClienteEditView clientePrev={cliente} />;
}

// ----------------------------------------------------------------------
