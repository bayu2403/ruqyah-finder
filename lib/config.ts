// Partner organisation shown across the site. Set `nama` (e.g. 'Lembaga
// Ruqyah Syar'iyyah Indonesia') before a presentation; while it is null the
// site uses neutral wording ("lembaga mitra") and shows no partner badge.
export const MITRA: { nama: string | null } = {
  nama: null,
};

export const MITRA_LABEL = MITRA.nama ?? 'lembaga mitra';
