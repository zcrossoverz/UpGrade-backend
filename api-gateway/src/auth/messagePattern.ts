export const MESSAGE_PATTERNS_AUTH = {
  login: {
    prefix: 'authentication',
    action: 'login',
  },
  validateToken: {
    prefix: 'authentication',
    action: 'validate-token',
  },
  revokeToken: {
    prefix: 'authentication',
    action: 'revoke-token',
  },
  refreshToken: {
    prefix: 'authentication',
    action: 'refresh-token',
  },
};
