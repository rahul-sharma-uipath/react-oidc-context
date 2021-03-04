import React, { ComponentType } from 'react';
import { User, UserManagerEvents, UserManager } from 'oidc-client';
import { AuthLogoutParams } from 'react-oidc-core-params-redirect';

export type oidcContext = {
  oidcUser: User | null;
  isEnabled: boolean;
  login: Function;
  logout: (args?: Partial<AuthLogoutParams>) => void;
  events: UserManagerEvents;
  authenticating: ComponentType;
  isLoading: boolean;
  isLoggingOut: boolean;
  userManager: UserManager;
  error: string;
};

export const AuthenticationContext = React.createContext<oidcContext>(null);

export const useReactOidc = () => {
  const { isEnabled, login, logout, oidcUser, events } = React.useContext(AuthenticationContext);
  return { isEnabled, login, logout, oidcUser, events };
};
