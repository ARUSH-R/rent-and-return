/**
 * Utility functions for working with user roles.
 */

/**
 * Checks if the user has the admin role.
 * @param {Object} user - The user object, should have a 'role' property.
 * @returns {boolean}
 */
export function isAdmin(user) {
  return user?.role === "admin";
}

/**
 * Checks if the user has the customer role.
 * @param {Object} user - The user object, should have a 'role' property.
 * @returns {boolean}
 */
export function isCustomer(user) {
  return user?.role === "customer";
}

/**
 * Checks if the user has the owner role.
 * @param {Object} user - The user object, should have a 'role' property.
 * @returns {boolean}
 */
export function isOwner(user) {
  return user?.role === "owner";
}

/**
 * Checks if the user has any of the specified roles.
 * @param {Object} user - The user object, should have a 'role' property.
 * @param {string[]} roles - Array of role strings to check.
 * @returns {boolean}
 */
export function hasRole(user, roles = []) {
  return roles.includes(user?.role);
}