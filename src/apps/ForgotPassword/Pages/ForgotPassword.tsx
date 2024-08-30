/* eslint-disable @typescript-eslint/no-unused-vars */

import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import Card from '../../Shared/Components/Card';
import Input from '../../Shared/Components/Input';
import Button from '../../Shared/Components/Button';
import { BACKEND } from '../../Shared/Consts/Back';

type ForgotPasswordProps = object
const ForgotPassword: FC<ForgotPasswordProps> = () => {
  const { enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { isValid } } = useForm<{ email: string }>({
    defaultValues: { email: '' },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        enqueueSnackbar('Se ha enviado un enlace a tu correo para restablecer la contraseña.', { variant: 'success' });
      } else {
        enqueueSnackbar(result.message || 'Hubo un error. Inténtalo de nuevo.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Ocurrió un error inesperado. Inténtalo de nuevo.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='relative h-screen w-full overflow-hidden bg-[url("/bg.jpg")] bg-auto bg-center bg-no-repeat'>
      <div className="h-full w-full max-w-[1620px] mx-auto">
        <div className="h-full w-full flex items-center">
          <div className="grow h-[150px] flex flex-col items-center justify-center p-6">
            <Card title="Recuperar Contraseña">
              <p className="mb-4 text-center">Ingresa tu correo para recibir un enlace de recuperación.</p>
              <Input
                name="email"
                register={register('email')}
                type="email"
                label="Correo electrónico"
                placeholder="example@mail.com"
              />
              <Button
                loading={loading}
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || loading}
              >
                Enviar
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
