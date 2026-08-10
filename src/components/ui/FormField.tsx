import styles from "./FormField.module.css";

interface BaseProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
}

interface InputProps extends BaseProps {
  type: "text" | "email" | "tel";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}

interface TextareaProps extends BaseProps {
  type: "textarea";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}

interface SelectProps extends BaseProps {
  type: "select";
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

interface CheckboxGroupProps extends BaseProps {
  type: "checkboxGroup";
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

interface RadioGroupProps extends BaseProps {
  type: "radioGroup";
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}

type Props =
  | InputProps
  | TextareaProps
  | SelectProps
  | CheckboxGroupProps
  | RadioGroupProps;

export default function FormField(props: Props) {
  const { id, label, required, error } = props;
  const errorId = `${id}-error`;

  return (
    <div className={styles.field}>
      <label htmlFor={props.type === "checkboxGroup" || props.type === "radioGroup" ? undefined : id} className={styles.label}>
        {label}
        {required && <span className={styles.req} aria-hidden="true"> *</span>}
      </label>

      {(props.type === "text" || props.type === "email" || props.type === "tel") && (
        <input
          id={id}
          type={props.type}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          required={required}
          aria-required={required}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
        />
      )}

      {props.type === "textarea" && (
        <textarea
          id={id}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          rows={props.rows ?? 4}
          required={required}
          aria-required={required}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={`${styles.textarea} ${error ? styles.inputError : ""}`}
        />
      )}

      {props.type === "select" && (
        <select
          id={id}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          required={required}
          aria-required={required}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={`${styles.select} ${error ? styles.inputError : ""}`}
        >
          <option value="">Select…</option>
          {props.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}

      {props.type === "checkboxGroup" && (
        <fieldset className={styles.fieldset} aria-required={required}>
          <legend className={styles.srOnly}>{label}</legend>
          <div className={styles.checkboxGrid}>
            {props.options.map((o) => (
              <label key={o.value} className={styles.checkLabel}>
                <input
                  type="checkbox"
                  value={o.value}
                  checked={props.selected.includes(o.value)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...props.selected, o.value]
                      : props.selected.filter((v) => v !== o.value);
                    props.onChange(next);
                  }}
                  className={styles.checkInput}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {props.type === "radioGroup" && (
        <fieldset className={styles.fieldset}>
          <legend className={styles.srOnly}>{label}</legend>
          <div className={styles.radioRow}>
            {props.options.map((o) => (
              <label key={o.value} className={styles.checkLabel}>
                <input
                  type="radio"
                  name={id}
                  value={o.value}
                  checked={props.value === o.value}
                  onChange={() => props.onChange(o.value)}
                  className={styles.checkInput}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {error && (
        <p id={errorId} className={styles.error} role="alert">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
