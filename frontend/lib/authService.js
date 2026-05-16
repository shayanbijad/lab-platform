const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function login(email, password, role = "patient") {
  const endpoints = {
    patient: "/auth/patient/login",
    sampler: "/auth/sampler/login",
    admin: "/auth/admin/login",
  };

  const endpoint = endpoints[role] || "/auth/login";

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.token) {
      throw new Error("No token received from server");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));

        // Prefer backend role if available
        const roleToStore = data.user.role || getRoleFromEndpoint(role);
        localStorage.setItem("role", roleToStore);
      } else {
        localStorage.setItem("role", getRoleFromEndpoint(role));
      }

      window.dispatchEvent(new Event("authChanged"));
    }

    return {
      success: true,
      user: data.user,
      role: data.user?.role || getRoleFromEndpoint(role),
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Login failed",
    };
  }
}

export async function register(email, password, phone, role = "patient") {
  const endpoints = {
    patient: "/auth/patient/register",
    sampler: "/auth/sampler/register",
    admin: "/auth/admin/register",
  };

  const endpoint = endpoints[role] || "/auth/register";

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return {
      success: true,
      userId: data.userId,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Registration failed",
    };
  }
}

export function logout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("authChanged"));
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
}

export function getUser() {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function isAdmin() {
  const role = getRole();
  return role === "LAB_ADMIN" || role === "SUPER_ADMIN";
}

export function isSampler() {
  return getRole() === "SAMPLER";
}

export function isPatient() {
  return getRole() === "PATIENT";
}

function getRoleFromEndpoint(endpoint) {
  const roleMap = {
    patient: "PATIENT",
    sampler: "SAMPLER",
    admin: "LAB_ADMIN",
  };

  return roleMap[endpoint] || "PATIENT";
}
