import { UsuarioEditView } from 'src/sections/usuarios/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Usuario: Editar` };

export default function Page({ params }) {
  const { id } = params;

  return <UsuarioEditView id={id} />;
}
