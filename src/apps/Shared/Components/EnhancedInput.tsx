import { FC, useRef, useState, MouseEvent } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

type InputProps = {
  type?: string;
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  onChange?: (value: any | null) => void;
  value?: any;
  name?: string;
};

const EnhancedInput: FC<InputProps> = ({
  label,
  placeholder,
  register,
  type = 'text',
  name,
}) => {
  if (!label || !placeholder) {
    throw new Error('Label and placeholder are required props');
  }

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setShowPassword((prev) => !prev);
    if (inputRef.current) {
      inputRef.current.type = showPassword ? 'password' : 'text';
    }
  };

  return (
    <div className="flex flex-col gap-y-2 font-sans">
      <label className="relative flex flex-col">
        <span className={`absolute left-3 -top-2.5 px-1 text-sm font-semibold transition-all duration-200 ${
          focus ? 'text-indigo-600' : 'text-gray-600'
        } bg-white`}>
          {label}
        </span>
        <input
          {...register}
          ref={(element) => {
            register?.ref(element);
            inputRef.current = element;
          }}
          className={`peer px-4 py-3 rounded-lg border-2 bg-white transition-all duration-200 focus:outline-none ${
            focus
              ? 'border-indigo-600 shadow-md shadow-indigo-100'
              : 'border-gray-300 hover:border-gray-400'
          } text-gray-800 placeholder-gray-400`}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          name={name}
          onFocus={() => setFocus(true)}
          onBlur={(event) => {
            setFocus(false);
            register?.onBlur && register.onBlur(event);
          }}
          onChange={(event) => {
            register?.onChange && register.onChange(event);
          }}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={handleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </label>
    </div>
  );
};

export default EnhancedInput;