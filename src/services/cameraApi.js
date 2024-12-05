const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
// Reusable function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Network response was not ok");
  }

  return response.json();
};

// Specific API calls
export const fetchCameras = () => apiRequest("/fetch/cameras");

export const updateCameraStatus = (id, status) =>
  apiRequest("/update/camera/status", {
    method: "POST",
    body: JSON.stringify({ id, status }),
  });

// (Optional) Example for delete (if supported)
export const deleteCamera = (id) =>
  apiRequest(`/delete/camera/${id}`, { method: "DELETE" });