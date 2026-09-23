export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function normalizeWa(input) {
  let digits = input.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  return digits;
}

// Ambil sampai 3 ustad terdekat/tercocok dari daftar ustad aktif+terverifikasi.
export function matchUstad(ustadList, { userLat, userLng, alamat }) {
  if (userLat !== null && userLng !== null) {
    return ustadList
      .filter((u) => u.lat !== null && u.lng !== null)
      .map((u) => ({ ustad: u, dist: haversineKm(userLat, userLng, u.lat, u.lng) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);
  }

  const alamatLower = alamat.toLowerCase();
  let byArea = ustadList
    .filter((u) => u.area && alamatLower.includes(u.area.toLowerCase()))
    .slice(0, 3)
    .map((u) => ({ ustad: u, dist: null }));

  if (byArea.length === 0) {
    byArea = ustadList.slice(0, 3).map((u) => ({ ustad: u, dist: null }));
  }
  return byArea;
}
