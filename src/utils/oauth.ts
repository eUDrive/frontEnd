/**
 * OAuth configuration and handlers
 */

export interface OAuthProvider {
  name: string;
  icon: string;
  clientId: string;
  authorizationEndpoint: string;
  scope: string;
}

export const oauthProviders: Record<string, OAuthProvider> = {
  google: {
    name: 'Google',
    icon: '🔍',
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid email profile',
  },
  github: {
    name: 'GitHub',
    icon: '🐙',
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || 'your-github-client-id',
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    scope: 'user:email',
  },
  microsoft: {
    name: 'Microsoft',
    icon: '🪟',
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || 'your-microsoft-client-id',
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    scope: 'openid email profile',
  },
};

/**
 * Generate OAuth authorization URL
 */
export const generateOAuthUrl = (
  provider: OAuthProvider,
  redirectUri: string,
  state: string
): string => {
  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: provider.scope,
    state,
  });

  return `${provider.authorizationEndpoint}?${params.toString()}`;
};

/**
 * Generate random state for CSRF protection
 */
export const generateRandomState = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Get OAuth provider by name
 */
export const getOAuthProvider = (providerName: string): OAuthProvider | null => {
  return oauthProviders[providerName.toLowerCase()] || null;
};
