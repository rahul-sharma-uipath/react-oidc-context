import React, { ComponentType, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
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

import { AuthenticationContext } from '../oidcContext';

const withServices = (WrappedComponent: any, Services: any) => (props: any) => {
  return <WrappedComponent {...props} {...Services} />;
};

type OidcComponentProps = PropsWithChildren<{
  location: Location;
  history: ReactOidcHistory;
  authenticateUserInternal: typeof authenticateUser;
  getUserManagerInternal: typeof getUserManager;
  isRequireAuthenticationInternal: typeof isRequireAuthentication;
  AuthenticatingInternal: typeof Authenticating;
  authParams?: Partial<AuthLoginParams>;
}>;

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
  const { authenticating, isEnabled, oidcUser, isLoggingOut } = useContext(AuthenticationContext);
  const userManager = useMemo(() => getUserManagerInternal(), [getUserManagerInternal]);

  useEffect(() => {
    oidcLog.info('Protection : ', isEnabled);
    if (isEnabled && !isLoggingOut) {
      oidcLog.info('Protected component mounted');
      authenticateUserInternal(userManager, location, history, undefined, authParams)();
    }
    return () => {
      oidcLog.info('Protected component unmounted');
    };
  }, [isEnabled, authenticateUserInternal, userManager, location, history, authParams, isLoggingOut]);

  const requiredAuth = useMemo(() => isRequireAuthenticationInternal(oidcUser as any, false) && isEnabled, [
    isEnabled,
    isRequireAuthenticationInternal,
    oidcUser,
  ]);

  const AuthenticatingComponent = authenticating || AuthenticatingInternal;
  return requiredAuth ? <AuthenticatingComponent /> : children;
};

const OidcSecure = withRouter(
  withServices(OidcSecureWithInjectedFunctions, {
    authenticateUserInternal: authenticateUser,
    getUserManagerInternal: getUserManager,
    isRequireAuthenticationInternal: isRequireAuthentication,
    AuthenticatingInternal: Authenticating,
  })
);

export const withOidcSecure = (WrappedComponent: ComponentType, authParams: Partial<AuthLoginParams> = {}) => (
  props: PropsWithChildren<any>
) => (
  <OidcSecure authParams={authParams}>
    <WrappedComponent {...props} />
  </OidcSecure>
);

export default OidcSecure;
