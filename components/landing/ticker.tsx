const ITEMS = [
  'Ustadz terverifikasi lembaga',
  'Gratis, tanpa biaya platform',
  'Satu permintaan, satu ustadz',
  'Lanjut di WhatsApp',
  'Data hanya untuk yang menangani',
  'Al-Qur’an dan doa dari sunnah',
  'Tanpa jimat, tanpa mantra',
];

function Row() {
  return (
    <div className="flex gap-11 whitespace-nowrap px-5 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
      {ITEMS.map((t, i) => (
        <span key={t}>
          {i % 2 === 0 && <em className="mr-2 not-italic text-[#a37415]">●</em>}
          {t}
        </span>
      ))}
    </div>
  );
}

// Decorative: the same promises are stated in full elsewhere on the page.
export function Ticker() {
  return (
    <div className="rk-ticker mt-14 overflow-hidden border-y border-border bg-[#f4f6f1]" aria-hidden="true">
      <div className="rk-ticker-track flex w-max">
        <Row />
        <Row />
      </div>
    </div>
  );
}
