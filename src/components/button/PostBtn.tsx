import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}
const PostBtn: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = 'px-6 py-1 rounded shadow-drop text-[12px] font-godob';
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-foreground',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-400',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PostBtn;
