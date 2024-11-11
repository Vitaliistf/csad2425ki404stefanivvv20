import styles from "./styles.module.css";

/**
 * @interface SelectProps
 * Generic props for the Select dropdown component.
 * @template T - The type of select options, either string or number.
 * @property options - List of options for selection.
 * @property onChange - Callback for option selection.
 * @property value - Selected value in the dropdown.
 */
interface SelectProps<T extends string | number> {
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  value: T;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
}

/**
 * @function Select
 * A generic dropdown component for selecting options.
 * @template T - Type of the select value.
 * @param {SelectProps<T>} props - Props for the Select component.
 * @returns {React.FC<SelectProps<T>>} The Select component.
 */
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
