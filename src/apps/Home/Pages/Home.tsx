import { FC, useEffect, useState } from 'react';
import { BACKEND } from '../../Shared/Consts/Back';
import { ClipboardList, Activity, CheckCircle2, Calendar, Flag, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  name: string;
  description: string;
  finishdate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'completed' | 'expired';
  category: string;
}

type KanbanBoardProps = object;

const KanbanBoard: FC<KanbanBoardProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const token = sessionStorage.getItem('user_token');

      try {
        const response = await fetch(`${BACKEND}/tasks/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data.data);
        } else {
          console.error('Error fetching tasks:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const getTasksByStatus = (status: Task['status']) => {
    let filteredTasks = tasks.filter((task) => task.status === status);

    // Aplicar filtro por prioridad
    if (filterPriority !== 'all') {
      filteredTasks = filteredTasks.filter((task) => task.priority === filterPriority);
    }

    // Aplicar filtro por fecha
    if (filterDate !== 'all') {
      filteredTasks = filteredTasks.filter((task) => {
        const taskDate = new Date(task.finishdate).toLocaleDateString();
        return taskDate === filterDate;
      });
    }

    return filteredTasks;
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <ClipboardList className="w-6 h-6 text-gray-600" />;
      case 'doing':
        return <Activity className="w-6 h-6 text-blue-600" />;
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      default:
        return null;
    }
  };

  const handleEditTask = (id: string) => {
    navigate(`edit-task/${id}`)
  };

  const handleDeleteTask = async (id: string) => {
    await fetch(`${BACKEND}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('user_token')}`,
      },
    });
    setSelectedTask(null);
    window.location.reload();
  };

  return (
    <div className='p-6 min-h-screen bg-[#bbebdf] bg-auto bg-center bg-no-repeat'>
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => navigate('create-task')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Crear tarea
        </button>
      </div>

      {/* Filtros */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <label className="mr-2">Filtrar por prioridad:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">Todas</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Filtrar por fecha:</label>
          <input
            type="date"
            value={filterDate === 'all' ? '' : filterDate}
            onChange={(e) => setFilterDate(e.target.value ? new Date(e.target.value).toLocaleDateString() : 'all')}
            className="p-2 border rounded"
          />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Tablero de Tareas</h1>
      <div className="flex space-x-6 overflow-x-auto pb-8 justify-center">
        {['todo', 'doing', 'completed'].map((status) => (
          <div key={status} className="bg-white rounded-lg p-4 w-80 flex-shrink-0 shadow-md">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              {getStatusIcon(status as Task['status'])}
              <span className="ml-2">{status.toUpperCase()}</span>
            </h2>
            <div className="space-y-4">
              {getTasksByStatus(status as Task['status']).map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="bg-gray-50 p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-lg font-semibold mb-2">{task.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(task.finishdate).toLocaleDateString()}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className={`${getPriorityColor(task.priority)} text-white px-2 py-1 rounded text-xs`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{task.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">{selectedTask.name}</h2>
            <p className="mb-4 text-gray-700">{selectedTask.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Fecha de finalización: {new Date(selectedTask.finishdate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Folder className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Categoría: {selectedTask.category}</span>
              </div>
              <div className="flex items-center">
                <Flag className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Prioridad: <strong className={`${getPriorityColor(selectedTask.priority)} text-white px-2 py-1 rounded`}>
                    {selectedTask.priority.toUpperCase()}
                  </strong>
                </span>
              </div>
              <div className="flex items-center">
                {getStatusIcon(selectedTask.status)}
                <span className="text-sm text-gray-600 ml-2">
                  Estado: {selectedTask.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedTask(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
              >
                Cerrar
              </button>
              <button 
                onClick={() => handleEditTask(selectedTask.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
