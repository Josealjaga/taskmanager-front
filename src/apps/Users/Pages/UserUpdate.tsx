import { FC, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Card2 from '../../Shared/Components/Card2';
import Input from '../../Shared/Components/Input';
import Button from '../../Shared/Components/Button';
import { BACKEND } from '../../Shared/Consts/Back';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  fotoperfil: string;
}

type UserUpdateProps = object;

const UserUpdate: FC<UserUpdateProps> = () => {
  const navigate = useNavigate();
  const snackbarRef = useRef<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const token = sessionStorage.getItem('user_token');
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, setValue, watch } = useForm<User>({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${BACKEND}/users/userById`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log('User data:', result);

          if (result?.data) {
            const user = result.data;

            setValue('name', user.name || '');
            setValue('email', user.email || '');
            setValue('fotoperfil', user.fotoperfil || '');
            setValue('password', '');
          } else {
            console.error('Error: No user data found');
          }
        } else {
          console.error('Error fetching user:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token, setValue]);

  const onSubmit = async (data: User) => {
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);

    const fotoperfil = (data.fotoperfil as unknown) as FileList;
    if (fotoperfil && fotoperfil.length > 0) {
      formData.append('fotoperfil', fotoperfil[0]);
    }

    const response = await fetch(`${BACKEND}/users`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, 
    });

    const result = await response.json();
    if ('success' in result && !result.success) {
      const { message } = result;

      if (snackbarRef.current) closeSnackbar(snackbarRef.current);

      snackbarRef.current = enqueueSnackbar(
        message || 'Hubo un error en el servidor. Reintente',
        { variant: 'error' }
      );
      return;
    }

    if (snackbarRef.current) closeSnackbar(snackbarRef.current);

    snackbarRef.current = enqueueSnackbar('Usuario actualizado exitosamente');
    navigate('/');
  } catch (err) {
    if (snackbarRef.current) closeSnackbar(snackbarRef.current);

    snackbarRef.current = enqueueSnackbar('Ocurrió un error inesperado', {
      variant: 'error',
    });
  } finally {
    setLoading(false);
  }
};

  // Obteniendo el valor actual del campo 'fotoperfil'
  const fotoPerfil = watch('fotoperfil');

  return (
    <section className='relative h-screen w-full overflow-hidden'>
      <div className='h-full w-full max-w-[1620px] mx-auto'>
        <div className='h-full w-full flex items-center'>
          <div className='grow'></div>
          <div className='grow h-full flex flex-col items-center justify-center p-6'>
            {/* Mostrar la imagen de perfil */}
            <img
              src={`${BACKEND}/${fotoPerfil}`}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full"
            />
            <Card2 title='Editar Usuario'>
              <Input
                name='name'
                register={register('name')}
                label='Nombre de usuario'
                placeholder='ej. Juan'
              />
              <Input
                name='email'
                register={register('email')}
                label='Correo electrónico'
                placeholder='ej. usuario@example.com'
              />
              <Input
                name='password'
                register={register('password')}
                type='password'
                label='Contraseña'
                placeholder='- - - - - - - - - - - -'
              />
              <Input
                name='fotoperfil'
                register={register('fotoperfil')}
                type='file'
                label='Foto de perfil'
                placeholder='foto.jpg'
              />
              <Button
                loading={loading}
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
              >
                Editar Usuario
              </Button>
            </Card2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserUpdate;
