// Simple map location picker utility using OpenStreetMap
export function initMap(containerId, onLocationSelect) {
  // Use browser's Geolocation API to get current position
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelect({ latitude, longitude });
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback to Tehran if geolocation fails
        onLocationSelect({ latitude: 35.6892, longitude: 51.389 });
      }
    );
  }
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
