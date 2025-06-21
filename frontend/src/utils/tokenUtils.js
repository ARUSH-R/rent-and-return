/**
 * Utility functions for handling authentication tokens.
 */

/**
 * Save token to localStorage.
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem("auth_token", token);
}

/**
 * Retrieve token from localStorage.
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