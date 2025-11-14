import { FOCUS_VISIBLE } from "@/lib/classNames";

type Props = {
  value: string;
  onChange: (next: string) => void;
  id?: string;
  required?: boolean;
  maxChars?: number;
  rows?: number;
  placeholder?: string;
  name?: string;
};

export function ReviewTextArea({
  value,
  onChange,
  id = "description",
  required = false,
  maxChars = 500,
  rows = 4,
  placeholder,
  name = "description",
}: Props) {
  const charCount = value.length;
  const charsLeft = maxChars - charCount;

  return (
    <section className="relative">
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={maxChars}
        rows={rows}
        aria-describedby={`${id}-counter`}
        className={`${FOCUS_VISIBLE} w-full bg-gray-100 dark:bg-white/10 rounded-3xl p-4 pt-7 leading-relaxed outline-none`}
        placeholder={placeholder}
      />

      <span
        id={`${id}-counter`}
        aria-live="polite"
        className={[
          "pointer-events-none select-none",
          "absolute top-2 right-3 text-xs",
          "opacity-60",
          charsLeft <= 50 ? "text-amber-600 dark:text-amber-400" : "",
          charsLeft <= 0 ? "text-red-600 dark:text-red-400" : "",
        ].join(" ")}
      >
        {charCount}/{maxChars}
      </span>
    </section>
  );
}
