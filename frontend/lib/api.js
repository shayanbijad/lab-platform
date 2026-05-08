export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

/* ---------------------------------- */
/* Base Fetch Helper                  */
/* ---------------------------------- */

async function request(url, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    throw new Error(
      `API error: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

/* ---------------------------------- */
/* Generic CRUD Helpers               */
/* ---------------------------------- */

export async function getData(resource) {
  return request(`${API_BASE_URL}/${resource}`);
}

export async function postData(resource, body) {
  return request(`${API_BASE_URL}/${resource}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function patchData(resource, body) {
  return request(`${API_BASE_URL}/${resource}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteData(resource) {
  return request(`${API_BASE_URL}/${resource}`, {
    method: "DELETE",
  });
}

/* ---------------------------------- */
/* Auth API                           */
/* ---------------------------------- */

export async function loginUser(data) {
  return postData("auth/login", data);
}

export async function registerUser(data) {
  return postData("auth/register", data);
}

/* ---------------------------------- */
/* Wizard / Smart Test Recommendation */
/* ---------------------------------- */

export async function recommendTests(data) {
  return postData("tests/recommend", data);
}

export async function createOrder(data) {
  return postData("orders", data);
}

/* ---------------------------------- */
/* Resources                          */
/* ---------------------------------- */

export async function getDoctors() {
  return getData("doctors");
}

export async function getPatients() {
  return getData("patients");
}

export async function getPatientById(patientId) {
  return getById("patients", patientId);
}

export async function getPatientByUserId(userId) {
  return request(`${API_BASE_URL}/patients/user/${userId}`);
}

export async function upsertPatientProfile(userId, data) {
  return patchData(`patients/user/${userId}`, data);
}

export async function getOrders() {
  return getData("orders");
}

export async function getOrdersByPatient(patientId) {
  return request(`${API_BASE_URL}/orders/by-patient/${patientId}`);
}

export async function getOrderById(orderId) {
  return getById("orders", orderId);
}

export async function getLabTests() {
  return getData("lab-tests");
}

export async function getLabs() {
  return getData("labs");
}

export async function getResults() {
  return getData("results");
}

export async function getAddresses() {
  return getData("addresses");
}

export async function getMissions() {
  return getData("missions");
}

/* ---------------------------------- */
/* Optional Single Item Fetch         */
/* ---------------------------------- */

export async function getById(resource, id) {
  return request(`${API_BASE_URL}/${resource}/${id}`);
}

export async function getDoctorById(id) {
  return getById("doctors", id);
}

export async function updateDoctor(id, data) {
  return patchData(`doctors/${id}`, data);
}

export async function createDoctor(data) {
  return postData("doctors", data);
}


export async function getBlogs(status) {
  const query = status ? `?status=${status}` : "";
  return request(`${API_BASE_URL}/blogs${query}`);
}

export async function getBlog(idOrSlug) {
  return request(`${API_BASE_URL}/blogs/${idOrSlug}`);
}

export async function createBlog(data) {
  return postData('blogs', data);
}

export async function updateBlog(id, data) {
  return patchData(`blogs/${id}`, data);
}

export async function deleteBlog(id) {
  return deleteData(`blogs/${id}`);
}

export async function uploadBlogCover(id, file) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/blogs/${id}/cover`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function removeBlogCover(id) {
  return deleteData(`blogs/${id}/cover`);
}

export async function uploadBlogInlineImage(file) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/blogs/uploads/image`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}


export async function getSamplerMissions(samplerUserId) {
  return request(`${API_BASE_URL}/missions/by-sampler/${samplerUserId}`);
}

export async function getMissionById(id) {
  return request(`${API_BASE_URL}/missions/${id}`);
}

export async function updateMissionStatus(id, status) {
  return patchData(`missions/${id}/status`, { status });
}


export async function getSamplerProfile(userId) {
  return request(`${API_BASE_URL}/samplers/by-user/${userId}`);
}

export async function updateSamplerProfile(userId, data) {
  return patchData(`samplers/by-user/${userId}`, data);
}

export async function startMission(id) {
  return patchData(`missions/${id}/start`, {});
}

/* ---------------------------------- */
/* Doctor CRM API                     */
/* ---------------------------------- */

export async function getDoctorCrmPatients() {
  return getData('doctor-crm/patients');
}

export async function getDoctorCrmOrders() {
  return getData('doctor-crm/orders');
}

export async function getDoctorCrmStats() {
  return getData('doctor-crm/stats');
}

/* ---------------------------------- */
/* Admin Doctor User Management       */
/* ---------------------------------- */

export async function getDoctorUsers() {
  return getData('users/doctor/all');
}

export async function getDoctorUser(id) {
  return getById('users/doctor', id);
}

export async function createDoctorUser(data) {
  return postData('users/doctor', data);
}

export async function updateDoctorUser(id, data) {
  return request(`${API_BASE_URL}/users/doctor/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
