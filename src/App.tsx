import { 
  FC, 
} from 'react';
import { SnackbarProvider, } from 'notistack';
import { RouterProvider, } from 'react-router-dom';

import Router from './Router.tsx';

const FIVE_SECONDS_IN_MS = 5000;

type AppProps = object;

const App: FC<AppProps> = () => {
  return (
    <SnackbarProvider 
      preventDuplicate
      autoHideDuration={FIVE_SECONDS_IN_MS}
      maxSnack={5}>
      <RouterProvider router={Router} />
    </SnackbarProvider>
  );
};

export default App;
