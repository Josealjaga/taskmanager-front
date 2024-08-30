/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../Shared/Components/Card';
import Input from '../../Shared/Components/Input';
import Button from '../../Shared/Components/Button';
import { BACKEND } from '../../Shared/Consts/Back';

const ResetPassword: FC = () => {
  const { token } = useParams<{ token: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { isValid }, watch } = useForm<{ password: string; confirmPassword: string }>({
    defaultValues: { password: '', confirmPassword: '' },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: { password: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: data.password }),
      });

      const result = await response.json();
      if (result.success) {
        enqueueSnackbar('Contraseña actualizada con éxito.', { variant: 'success' });
        navigate('/login');
      } else {
        enqueueSnackbar(result.message || 'Error al actualizar la contraseña.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Ocurrió un error inesperado. Inténtalo de nuevo.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='relative h-screen w-full overflow-hidden bg-[url("/bg.jpg")] bg-auto bg-center bg-no-repeat '>
      <div className="h-full w-full max-w-[1620px] mx-auto">
        <div className="h-full w-full flex items-center">
          <div className="grow h-[150px] flex flex-col items-center justify-center p-6">
            <Card title="Restablecer Contraseña">
              <Input
                name="password"
                register={register('password')}
                type="password"
                label="Nueva Contraseña"
                placeholder="- - - - - - - -"
              />
              <Input
                name="confirmPassword"
                register={register('confirmPassword')}
                type="password"
                label="Confirmar Contraseña"
                placeholder="- - - - - - - -"
              />
              <Button
                loading={loading}
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || loading || watch('password') !== watch('confirmPassword')}
              >
                Restablecer Contraseña
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;