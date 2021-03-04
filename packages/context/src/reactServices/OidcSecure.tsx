import React, { ComponentType, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import { UserManager } from 'oidc-client';
import {
  withRouter,
  Authenticating,
  getUserManager,
  authenticateUser,
  isRequireAuthentication,
  oidcLog,
  ReactOidcHistory,
  AuthLoginParams,
} from 'react-oidc-core-params-redirect';

import withServices from '../withServices';
import { AuthenticationContext } from '../oidcContext';

type OidcComponentProps = PropsWithChildren<{
  location: Location;
  history: ReactOidcHistory;
  authenticateUserInternal: typeof authenticateUser;
  getUserManagerInternal: typeof getUserManager;
  isRequireAuthenticationInternal: typeof isRequireAuthentication;
  AuthenticatingInternal: typeof Authenticating;
  authParams?: Partial<AuthLoginParams>;
}>;

export const useOidcSecure = (
  authenticateUserInternal: typeof authenticateUser,
  userManager: UserManager,
  location: Location,
  history: ReactOidcHistory,
  oidcLogInternal: typeof oidcLog,
  AuthenticatingInternal: typeof Authenticating,
  isRequireAuthenticationInternal: typeof isRequireAuthentication,
  WrappedComponent: ComponentType,
  authParams?: Partial<AuthLoginParams>
): ComponentType => {
  const { isEnabled, oidcUser, authenticating, isLoggingOut } = useContext(AuthenticationContext);
  useEffect(() => {
    oidcLogInternal.info('Protection : ', isEnabled);
    if (isEnabled && !isLoggingOut) {
      oidcLogInternal.info('Protected component mounted');
      authenticateUserInternal(userManager, location, history, null, authParams)();
    }
    return () => {
      oidcLogInternal.info('Protected component unmounted');
    };
  }, [isEnabled, authenticateUserInternal, userManager, oidcLogInternal, location, history, isLoggingOut]);

  const requiredAuth = useMemo(() => isRequireAuthenticationInternal(oidcUser, false) && isEnabled, [
    isEnabled,
    isRequireAuthenticationInternal,
    oidcUser,
  ]);

  oidcLogInternal.info('required auth', requiredAuth);

  const AuthenticatingComponent: ComponentType = authenticating || AuthenticatingInternal;
  return requiredAuth ? AuthenticatingComponent : WrappedComponent;
};

export const OidcSecureWithInjectedFunctions = ({
  children,
  location,
  history,
  authenticateUserInternal,
  getUserManagerInternal,
  isRequireAuthenticationInternal,
  AuthenticatingInternal,
  authParams,
}: OidcComponentProps) => {
  const userManager = getUserManagerInternal();
  const WrappedComponent = useMemo(() => () => <>{children}</>, [children]);
  const ReactOidcComponent = useOidcSecure(
    authenticateUserInternal,
    userManager,
    location,
    history,
    oidcLog,
    AuthenticatingInternal,
    isRequireAuthenticationInternal,
    WrappedComponent,
    authParams
  );

  return <ReactOidcComponent key="react-oidc-wrapped-component" />;
};

const OidcSecure = withServices(OidcSecureWithInjectedFunctions, {
  authenticateUserInternal: authenticateUser,
  getUserManagerInternal: getUserManager,
  isRequireAuthenticationInternal: isRequireAuthentication,
  AuthenticatingInternal: Authenticating,
});

export const withOidcSecure = (WrappedComponent: ComponentType, authParams: Partial<AuthLoginParams> = {}) => (
  props: PropsWithChildren<any>
) => (
  <OidcSecure authParams={authParams}>
    <WrappedComponent {...props} />
  </OidcSecure>
);

export default OidcSecure;
