import { CONFIG } from 'src/config-global';
import { getPedido } from 'src/actions/pedidos';

import { PedidoEditView } from 'src/sections/pedidos/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Pedido | Dashboard - ${CONFIG.site.name}` };

export default async function Page({ params }) {
  const { id } = params;

  const { pedido, estadosPedido } = await getPedido(id);

  return <PedidoEditView pedidoPrev={pedido} estadosPedido={estadosPedido} />;
}

// ----------------------------------------------------------------------
