type FileAttachmentFieldProps = {
  label: string;
  accept: string;
  hint: string;
  disabled: boolean;
  attachedFileName: string | null;
  savedText: string;
  hasSavedFile: boolean;
  onSelect: (file: File) => void;
};

export function FileAttachmentField({
  label,
  accept,
  hint,
  disabled,
  attachedFileName,
  savedText,
  hasSavedFile,
  onSelect,
}: FileAttachmentFieldProps) {
  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
        {label}
      </label>
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        className="w-full min-h-11 cursor-pointer rounded-lg border border-neutral-300 bg-white px-3.5 py-3 text-sm leading-snug text-neutral-900 shadow-sm outline-none transition file:mr-4 file:cursor-pointer file:rounded-md file:border file:border-neutral-200 file:bg-neutral-50 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-neutral-800 placeholder:text-neutral-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          onSelect(file);
        }}
      />
      <p className="text-xs leading-relaxed text-neutral-500">{hint}</p>
      {attachedFileName ? (
        <p className="text-xs leading-relaxed text-neutral-500">
          Attached: {attachedFileName}
        </p>
      ) : hasSavedFile ? (
        <p className="text-xs leading-relaxed text-neutral-500">{savedText}</p>
      ) : null}
    </div>
  );
}
