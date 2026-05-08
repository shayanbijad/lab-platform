export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export async function login(email, password, role = 'patient') {
  const endpoints = {
    patient: '/auth/patient/login',
    sampler: '/auth/sampler/login',
    admin: '/auth/admin/login',
    doctor: '/auth/doctor/login',
  };

  const endpoint = endpoints[role] || '/auth/login';

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await res.json();
    
    // Store token, role, and user data in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', getRoleFromEndpoint(role));
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Dispatch custom event to notify components of login
      window.dispatchEvent(new Event('authChanged'));
      
      return { success: true, role: getRoleFromEndpoint(role) };
    }

    throw new Error('No token received');
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function register(email, password, phone, role = 'patient') {
  const endpoints = {
    patient: '/auth/patient/register',
    sampler: '/auth/sampler/register',
    admin: '/auth/admin/register',
    doctor: '/auth/doctor/register',
  };

  const endpoint = endpoints[role] || '/auth/register';

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, phone }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await res.json();
    return { success: true, userId: data.userId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  
  // Dispatch custom event to notify components of logout
  window.dispatchEvent(new Event('authChanged'));
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getRole() {
  return localStorage.getItem('role');
}

export function isAuthenticated() {
  return !!getToken();
}

export function isAdmin() {
  const role = getRole();
  return role === 'LAB_ADMIN' || role === 'SUPER_ADMIN';
}

export function isDoctor() {
  const role = getRole();
  return role === 'DOCTOR';
}

function getRoleFromEndpoint(endpoint) {
  const roleMap = {
    patient: 'PATIENT',
    sampler: 'SAMPLER',
    admin: 'LAB_ADMIN',
    doctor: 'DOCTOR',
  };
  return roleMap[endpoint] || 'PATIENT';
}

