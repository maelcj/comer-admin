import { CONFIG } from 'src/config-global';

import { ComentariosView } from 'src/sections/comentarios/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Comentarios | ${CONFIG.site.name}` };

export default async function Page({ searchParams }) {
  const { page } = await searchParams;
  return <ComentariosView page={page} />;
}
