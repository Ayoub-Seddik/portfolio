type Props = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title = "Confirm",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg">
        <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-[var(--red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--red-dark)]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
