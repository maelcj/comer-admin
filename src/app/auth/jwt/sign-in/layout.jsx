import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <GuestGuard>
      <AuthSplitLayout section={{ title: 'Hola, bienvenido de vuelta' }}>
        {children}
      </AuthSplitLayout>
    </GuestGuard>
  );
}
