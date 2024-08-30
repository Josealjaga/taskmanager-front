/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  FC, 
  useRef,
  useState,
  MouseEvent,
} from 'react';

import { UseFormRegisterReturn, } from 'react-hook-form';

type InputProps = object & {
  type?: string;
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn,
  onChange?: (value: any | null) => void;
  value?: any;
  name?: string;
};

const Input: FC<InputProps> = ({
  label,
  placeholder,
  register,
  type = 'text',
}) => {
  if (!label || !placeholder)
    throw new Error('Some props are required');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [focus, setFocus,] = useState<boolean>(false);
  const [showPassword, setShowPassword,] = useState<boolean>(false);

  const handleShowPassword: (event: MouseEvent) => void = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setShowPassword((isShowingPassword) => {
      if (!isShowingPassword) {
        if (inputRef?.current)
          inputRef.current.type = 'text';
      } else {
        if (inputRef?.current)
          inputRef.current.type = 'password';
      }

      return !isShowingPassword;
    });
  };

  return (
    <div className='flex flex-col gap-y-2'>
      <label className={`relative flex flex-col px-6 py-3 gap-y-1 rounded-lg border-2 bg-white ${focus ? 'border-blue-700' : 'border-gray-400'}`}>
        <span className={`text-sm font-bold leading-[14px] ${focus ? 'text-blue-700' : 'text-gray-700'}`}>
          {label}
        </span>
        <input
          {...register}
          ref={(element) => {
            register?.ref(element);
            inputRef.current = element;
          }}
          className="focus:outline-none"
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={(event) => {
            setFocus(false);
            if (register?.onBlur) 
              register?.onBlur(event);
          }}
          onChange={(event) => {
            if (register?.onChange)
              register?.onChange(event);
          }} />
        {type === 'password' && (
          <span 
            onClick={handleShowPassword}
            className='absolute top-[25%] right-0 my-auto py-1 px-4 bg-red-100 text-xs rounded-md text-red-900 mr-6 hover:cursor-pointer'>
            {!showPassword ? 'Mostrar contraseña' : 'Ocultar contraseña'}
          </span>
        )}
      </label>
    </div>
  );
}

export default Input;