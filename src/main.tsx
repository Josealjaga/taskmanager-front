import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

function bootstrap(): void {
  const rootElement = document.getElementById('root');
  // ! Paso 1. Renderizado de los componentes o entry point
  createRoot(rootElement!)
    .render(
      <StrictMode>
        <Suspense fallback={<p>Loading...</p>}>
          <App />
        </Suspense>
      </StrictMode>
    );
}

bootstrap();
