/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  FC, 
  useRef, 
  useState, 
} from 'react';
import { useSnackbar, } from 'notistack';
import { useForm, } from 'react-hook-form';
import { useNavigate, } from 'react-router-dom';

import Card from '../../Shared/Components/Card';
import Input from '../../Shared/Components/Input';
import Button from '../../Shared/Components/Button';
import { BACKEND } from '../../Shared/Consts/Back';

interface User {
  email: string;
  name: string;
  password: string;
  fotoperfil: File;
}
type SignupProps = object;

const Signup: FC<SignupProps> = () => {
  const navigate = useNavigate();
  const snackbarRef = useRef<string | number | null>(null);
  
  const {
    closeSnackbar,
    enqueueSnackbar,
  } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { isValid, },
  } = useForm<Pick<User, 'email' | 'name' | 'password'| 'fotoperfil'>>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  
  const [loading, setLoading,] = useState<boolean>(false);

 const onSubmit = async (data: Pick<User, 'name' | 'email' | 'password'| 'fotoperfil'>) => {
  setLoading(true);

  try {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    
    // Acceder al archivo correctamente
    if (data.fotoperfil instanceof FileList && data.fotoperfil.length > 0) {
      formData.append('fotoperfil', data.fotoperfil[0]);
    }

    const response = await fetch(`${BACKEND}/auth/signup`, { 
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if ('success' in result && !result.success) {
      const { message } = result;

      if (snackbarRef.current) 
        closeSnackbar(snackbarRef.current);

      snackbarRef.current = enqueueSnackbar(message ? message : 'Hubo en el servidor. Reintente', {
        variant: 'error',
      });
      return;
    }

    if (snackbarRef.current)
      closeSnackbar(snackbarRef.current);

    snackbarRef.current = enqueueSnackbar('El usuario se ha registrado');
    navigate('/login');
  } catch (err) {
    if (snackbarRef.current)
      closeSnackbar(snackbarRef.current);

    snackbarRef.current = enqueueSnackbar('Ocurrió un error inesperado', {
      variant: 'error',
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <section className='relative h-screen w-full overflow-hidden bg-[url("/bg.jpg")] bg-auto bg-center bg-no-repeat '>
  <div className='h-full w-full max-w-[1620px] mx-auto'>
    <div className='flex h-full items-center justify-center'>
      <Card title='Registrese'>
        <Input
          name='name'
          register={register('name')}
          label='Nombre completo'
          placeholder='Ej. Pepe Perez'/>
        <Input
          name='email'
          register={register('email')}
          type="email"
          label='Correo electronico'
          placeholder='example@mail.com'/>
        <Input
          name='password'
          register={register('password')}
          type='password'
          label='Contraseña'
          placeholder='- - - - - - - -'/>
         <Input
          name='fotoperfil'
          register={register('fotoperfil')}
          type='file'
          label='Foto de perfil'
          placeholder='adjuntar una imagen'/> 
        <Button
          loading={loading}
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || loading}>
          Registrarme
        </Button>
      </Card>
    </div>
  </div>
</section>
  );
};

export default Signup;
