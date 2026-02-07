const Input = ({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  autoComplete = "off",
}: {
  label: string;
  value: string;
  // eslint-disable-next-line no-unused-vars -- callback type; param name is for API clarity
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: string;
  autoComplete?: string;
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        disabled={disabled}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default Input;
