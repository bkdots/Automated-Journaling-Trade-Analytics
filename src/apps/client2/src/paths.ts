export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    journal: '/dashboard/journal',
    trade: '/dashboard/journal/trade',
    exchanges: '/dashboard/exchanges',
    exchange: '/dashboard/exchanges/exchange',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
