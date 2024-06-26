import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { SignUpData, InputProps } from '@/types';

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { id, label, type = 'text', error, placeholder = '', register },
  ref,
) => {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        className={cn(
          'w-[250px] border border-popover-foreground text-card-foreground text-sm rounded-md px-6 pt-6 pb-1 my-1 focus:outline-none focus:ring-0 appearance-none block peer',
          error && 'border-primary',
        )}
        placeholder={placeholder}
        {...register(id as keyof SignUpData)}
        ref={ref}
      />
      <label
        className={cn(
          'absolute text-card-foreground text-sm duration-150 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-6',
          'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0',
          'peer-focus:scale-75 peer-focus:-translate-y-3',
        )}
        htmlFor={id}
      >
        {label}
      </label>
      {error && <span className="text-primary text-sm">{error}</span>}
    </div>
  );
};

export default forwardRef(Input);
