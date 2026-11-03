export function SectionHead({
  eyebrow,
  title,
  lead,
  icon,
  className = '',
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rk-reveal mb-12 flex max-w-[44em] flex-col gap-3.5 ${className}`}>
      <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
        {icon}
        {eyebrow}
      </p>
      <h2 className="text-[clamp(30px,4vw,50px)] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground [text-wrap:balance]">
        {title}
      </h2>
      {lead && <p className="text-[17px] text-muted-foreground">{lead}</p>}
    </div>
  );
}
