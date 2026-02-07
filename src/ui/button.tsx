"use client";
export const Button = ({
  children,
  type = "submit",
  disabled,
  onClick,
  className,
}: {
  children: React.ReactNode;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg bg-slate-800 text-white px-4 py-2 text-sm font-medium hover:bg-slate-700 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};
