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
  if (!token) return null;
  
  try {
    // JWT tokens have three parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload);
    
    // Check if token is expired
    if (parsedPayload.exp && parsedPayload.exp * 1000 < Date.now()) {
      return null;
    }
    
    // Return user object with relevant fields
    return {
      id: parsedPayload.sub, // subject is typically the user identifier
      username: parsedPayload.sub,
      email: parsedPayload.sub, // In our case, sub is the email
      role: parsedPayload.role,
      exp: parsedPayload.exp,
      iat: parsedPayload.iat
    };
  } catch (error) {
    return null;
  }
};
