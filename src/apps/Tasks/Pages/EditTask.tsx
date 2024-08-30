import { FC, useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import Card2 from '../../Shared/Components/Card2';
import Input from '../../Shared/Components/Input';
import Button from '../../Shared/Components/Button';
import { BACKEND } from '../../Shared/Consts/Back';


interface Task {
  id: string;
  name: string;
  description: string;
  finishdate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'completed' | 'expired';
  category: string;
}


type EditTaskProps = object;

const EditTask: FC<EditTaskProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const snackbarRef = useRef<string | number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const token = sessionStorage.getItem('user_token');
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<Task>({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
 
    const fetchRooms = async () => {
      const response = await fetch(`${BACKEND}/tasks/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        const task = data.data;
          setValue('name', task.name);
          setValue('description', task.description);
          setValue('finishdate', task.finishdate);
          setValue('priority', task.priority);
          setValue('status', task.status);
          setValue('category', task.category);
      } else {
        console.error('Error fetching tasks');
      }
    };

    fetchRooms();
  }, [id, setValue]);

  

  const onSubmit = async (data: Task) => {
    setLoading(true);

    try {
      const body = JSON.stringify(data);
      

      const response = await fetch(`${BACKEND}/tasks/${id}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body,
      });

      const result = await response.json();
      if ('success' in result && !result.success) {
        const { message } = result;

        if (snackbarRef.current) 
          closeSnackbar(snackbarRef.current);

        snackbarRef.current = enqueueSnackbar(message ? message : 'Hubo un error en el servidor. Reintente', {
          variant: 'error',
        });
        return;
      }

      if (snackbarRef.current)
        closeSnackbar(snackbarRef.current);

      snackbarRef.current = enqueueSnackbar('Tarea actualizada exitosamente');
      navigate('/');
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
    <section className='relative h-screen w-full overflow-hidden bg-[url("/fondo3.jpg")] bg-auto bg-center bg-no-repeat'>
      <div className='h-full w-full max-w-[1620px] mx-auto'>
        <div className='h-full w-full flex items-center'>
          <div className='grow'></div>
          <div className='grow h-full flex flex-col items-center justify-center p-6'>
            <Card2 title='Editar Tarea'>
              <Input
                name='name'
                register={register('name')}
                label='Nombre de la tarea'
                placeholder='Ej. Cocinar'/>
              <Input
                name='description'
                register={register('description')}
                label='Descripción'
                placeholder='Descripción de la tarea'/>
              <Input
                name='finishdate'
                register={register('finishdate')}
                type='date'
                label='Fecha de vencimiento de la tarea'
                placeholder='Ej. 2022-01-01'/>
              <div className="flex flex-col gap-y-2">
                <label htmlFor="priority" className={`relative flex flex-col px-6 py-3 gap-y-1 rounded-lg border-2 bg-white ${onfocus ? 'border-blue-700' : 'border-gray-400'}`}>
                <span className={`text-sm font-bold leading-[14px] ${onfocus ? 'text-blue-700' : 'text-gray-700'}`}>
                Prioridad
                </span>
                <select
                  id="priority"
                  {...register('priority')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecciona la prioridad de la tarea</option>
                  <option value='low'>Baja</option>
                  <option value='medium'>Media</option>
                  <option value='high'>Alta</option>
                </select>
                </label>
                <label htmlFor="status" className={`relative flex flex-col px-6 py-3 gap-y-1 rounded-lg border-2 bg-white ${onfocus ? 'border-blue-700' : 'border-gray-400'}`}>
                <span className={`text-sm font-bold leading-[14px] ${onfocus ? 'text-blue-700' : 'text-gray-700'}`}>
                Estado
                </span>
                <select
                  id="status"
                  {...register('status')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Selecciona el estado de la tarea</option>
                  <option value='todo'>Pendiente</option>
                  <option value='doing'>En proceso</option>
                  <option value='completed'>Completada</option>
                </select>
                </label>
              </div>
              <Input
                name='category'
                register={register('category')}
                label='Categoria de la tarea'
                placeholder='Ej. Quehaceres, estudio, trabajo, etc...'/>
              <Button
                loading={loading}
                onClick={handleSubmit(onSubmit)}
                disabled={loading}>
                Editar Tarea
              </Button>
            </Card2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditTask;