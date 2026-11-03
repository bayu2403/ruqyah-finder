const ITEMS = [
  'Ustadz terverifikasi lembaga',
  'Gratis, tanpa biaya platform',
  'Satu permintaan, satu ustadz',
  'Lanjut di WhatsApp',
  'Data hanya untuk yang menangani',
];

export function Ticker() {
  return (
    <div className="mt-14 border-y border-border bg-[#f4f6f1]">
      <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-4 text-[13px] font-semibold text-muted-foreground sm:px-6">
        {ITEMS.map((t) => (
          <li key={t} className="flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
