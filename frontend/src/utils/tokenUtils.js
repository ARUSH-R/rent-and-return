/**
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem("auth_token", token);
}

/**
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem("auth_token");
}

/**
 * Remove token from localStorage.
 */
export function removeToken() {
  localStorage.removeItem("auth_token");
}

/**
 * Check if a token exists (user is authenticated).
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getToken();
}


export const decodeToken = (token) => {
  // logic here
};
