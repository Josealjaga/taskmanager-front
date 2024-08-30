import { FC, PropsWithChildren } from 'react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';

type CardProps = PropsWithChildren<{
  title: string;
  isEditing?: boolean;
}>;

const Card2: FC<CardProps> = ({ title, children, isEditing = false }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative min-w-[450px] max-w-2xl min-h-[650px] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white z-0"></div>
      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            {title}
            {isEditing && (
              <Pencil className="ml-2 w-6 h-6 text-indigo-500" aria-hidden="true" />
            )}
          </h2>
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
        </div>
        <div className="text-black rounded-xl shadow-inner p-6 mb-6">
          <div className="flex flex-col gap-y-4">{children}</div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    </motion.article>
  );
};

export default Card2;