import React, { forwardRef } from 'react';

interface TextInputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { type, value, onChange, placeholder, required, children, className },
    ref,
  ) => (
    <div className="flex items-center input-container">
      {children && (
        <div className="my-4 input-prefix font-godob">{children}</div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        ref={ref}
        className={`w-[250px] mx-2 p-2 border rounded focus:outline-none text-[12px] ${className}`}
      />
    </div>
  ),
);
