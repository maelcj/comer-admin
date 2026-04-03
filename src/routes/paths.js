// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    productos: {
      root: `${ROOTS.DASHBOARD}/productos`,
      edit: (id) => `${ROOTS.DASHBOARD}/productos/${id}`,
      create: `${ROOTS.DASHBOARD}/productos/create`,
    },
    refacciones: {
      root: `${ROOTS.DASHBOARD}/refacciones`,
      edit: (id) => `${ROOTS.DASHBOARD}/refacciones/${id}`,
      create: `${ROOTS.DASHBOARD}/refacciones/create`,
    },
    pos: {
      root: `${ROOTS.DASHBOARD}/pos`,
    },
    clientes: {
      edit: (id) => `${ROOTS.DASHBOARD}/clientes/${id}`,
      create: `${ROOTS.DASHBOARD}/clientes/create`,
    },
    usuarios: {
      root: `${ROOTS.DASHBOARD}/usuarios`,
      new: `${ROOTS.DASHBOARD}/usuarios/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/usuarios/${id}`,
    },
    roles: {
      root: `${ROOTS.DASHBOARD}/roles`,
      new: `${ROOTS.DASHBOARD}/roles/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/roles/${id}`,
    },
    cotizaciones: {
      root: `${ROOTS.DASHBOARD}/cotizaciones`,
      edit: (id) => `${ROOTS.DASHBOARD}/cotizaciones/${id}`,
    },
    pedidos: {
      root: `${ROOTS.DASHBOARD}/pedidos`,
      edit: (id) => `${ROOTS.DASHBOARD}/pedidos/${id}`,
    },
    categorias: {
      root: `${ROOTS.DASHBOARD}/categorias`,
    },
    ofertas: {
      root: `${ROOTS.DASHBOARD}/ofertas`,
    },
    cupones: {
      root: `${ROOTS.DASHBOARD}/cupones`,
    },
    comentarios: {
      root: `${ROOTS.DASHBOARD}/comentarios`,
    },
    carritos: {
      root: `${ROOTS.DASHBOARD}/carritos`,
      edit: (id) => `${ROOTS.DASHBOARD}/carritos/${id}/editar`,
    },
    ads: {
      root: `${ROOTS.DASHBOARD}/ads`,
    },
    settings: {
      root: `${ROOTS.DASHBOARD}/settings`,
    },
    google: {
      root: `${ROOTS.DASHBOARD}/google`,
      edit: (id) => `${ROOTS.DASHBOARD}/google/${id}`,
      create: `${ROOTS.DASHBOARD}/google/create`,
    },
    logs: {
      root: `${ROOTS.DASHBOARD}/logs`,
    },
    estadisticas: {
      root: `${ROOTS.DASHBOARD}/estadisticas`,
    },
  },
};
