const AUTH_TOKEN_KEY = "story_app_auth_token";

export const saveToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};
