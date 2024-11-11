import styles from "./styles.module.css";

interface SelectProps<T extends string | number> {
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  value: T;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
}

export function Select<T extends string | number>({
  options,
  onChange,
  value,
  className = "",
  ...props
}: SelectProps<T>) {
  return (
    <select
      className={`${styles.select} ${className}`}
      value={value}
      onChange={(e) => {
        const newValue = (
          typeof value === "number" ? Number(e.target.value) : e.target.value
        ) as T;
        onChange(newValue);
      }}
      {...props}
    >
      {options.map((option) => (
        <option key={String(option.value)} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
