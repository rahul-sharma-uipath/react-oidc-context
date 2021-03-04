export interface AuthLoginParams {
  response_type: string;
  scope: string;
  redirect_uri: string;
  prompt: string;
  display: string;
  max_age: number;
  ui_locales: string;
  acr_values: string;
  resource: string;
  response_mode: string;
  extraQueryParams: any;
  extraTokenParams: any;
}

export interface AuthLogoutParams {
  force_logout_uri: string;
  post_logout_redirect_uri: string;
  useReplaceToNavigate: boolean;
  id_token_hint: string;
}
