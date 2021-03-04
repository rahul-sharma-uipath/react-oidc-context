import { oidcLog } from './loggerService';
import { User, UserManager } from 'oidc-client';
import { ReactOidcHistory } from '../routes/withRouter';
import { AuthLoginParams, AuthLogoutParams } from '../authparams';

let userRequested = false;
let numberAuthentication = 0;

export const isRequireAuthentication = (user: User, isForce?: boolean): boolean => isForce || !user || (user && user.expired === true);

export const isRequireSignin = (oidcUser: User, isForce?: boolean) => isForce || !oidcUser;

export const authenticateUser = (
  userManager: UserManager,
  location: Location,
  history?: ReactOidcHistory,
  user: User = null,
  authParams: Partial<AuthLoginParams> = {}
) => async (isForce: boolean = false, callbackPath: string = null) => {
  let oidcUser = user;
  if (!oidcUser) {
    oidcUser = await userManager.getUser();
  }
  if (userRequested) {
    return;
  }
  numberAuthentication++;
  const url = callbackPath || location.pathname + (location.search || '') + (location.hash || '');

  if (isRequireSignin(oidcUser, isForce)) {
    oidcLog.info('authenticate user...');
    userRequested = true;
    await userManager.signinRedirect({ data: { url }, ...authParams });
    userRequested = false;
  } else if (oidcUser && oidcUser.expired) {
    userRequested = true;
    try {
      await userManager.signinSilent();
    } catch (error) {
      if (numberAuthentication <= 1) {
        await userManager.signinRedirect({ data: { url } });
      } else {
        userRequested = false;
        oidcLog.warn(`session lost ${error.toString()}`);
        history.push(`/authentication/session-lost?path=${encodeURI(url)}`);
      }
    }
    userRequested = false;
  }
};

export const logoutUser = async (userManager: UserManager, params?: Partial<AuthLogoutParams>) => {
  if (!userManager || !userManager.getUser) {
    return;
  }
  const oidcUser = await userManager.getUser();
  if (oidcUser) {
    oidcLog.info('Logout user...');
    await userManager.signoutRedirect(params);
  } else if(params?.force_logout_uri) {
    oidcLog.info('Force logout user...');
    window.location.assign(params.force_logout_uri);
  }
};

export const signinSilent = (getUserManager: () => UserManager) => (data: any = undefined) => getUserManager().signinSilent(data);
