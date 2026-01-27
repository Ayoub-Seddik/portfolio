type Props = { level: number };

export default function SkillBar({ level }: Props) {
  const safe = Math.min(10, Math.max(1, level));
  const percent = (safe / 10) * 100;

  return (
    <div>
      <div className="h-2 w-full rounded-full bg-[var(--border)]/80">
        <div
          className="h-2 rounded-full bg-[var(--red)] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">{safe} / 10</p>
    </div>
  );
}
