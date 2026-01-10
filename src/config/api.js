/**
 * Auto-detect API URL based on window.location
 * This allows the app to work on localhost, local network IP, and any domain
 */

function getApiUrl() {
  // Check if explicitly set in env
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If not "auto", use the provided URL
  if (envUrl && envUrl !== 'auto') {
    return envUrl;
  }
  
  // Auto-detect based on current location
  const protocol = window.location.protocol; // http: or https:
  const hostname = window.location.hostname; // localhost, 192.168.x.x, or domain
  const port = '3001'; // Backend port
  
  return `${protocol}//${hostname}:${port}/api`;
}

function getSocketUrl() {
  // Socket.IO connects to same host but without /api suffix
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = '3001';
  
  return `${protocol}//${hostname}:${port}`;
}

export const API_URL = getApiUrl();
export const SOCKET_URL = getSocketUrl();

// Log for debugging
console.log('🌐 API Configuration:');
console.log('  API URL:', API_URL);
console.log('  Socket URL:', SOCKET_URL);
console.log('  Current host:', window.location.hostname);
