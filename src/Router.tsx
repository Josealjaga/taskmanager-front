import { lazy, } from 'react';
import { createBrowserRouter, redirect, RouteObject, } from 'react-router-dom';

import RootLayout from './apps/Root/RootLayout';

const routes: Array<RouteObject> = [
  {
    id: 'root',
    path: '',
    element: <RootLayout />,
    children: [
      {
        id: 'login',
        path: 'login',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (storedToken) {
            return redirect('/');
          }

          return true
        },
        Component: lazy(
          () => import('./apps/Login/Pages/Login'),
        ),
      },
      {
        id: 'register',
        path: 'signup',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (storedToken) {
            return redirect('/');
          }
          
          return true;
        },
        Component: lazy(
          () => import('./apps/Signup/Pages/Signup'),
        ),
      },
      {
        id: 'forgot-password',
        path: 'forgot-password',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (storedToken) {
            return redirect('/');
          }
          
          return true;
        },
        Component: lazy(
          () => import('./apps/ForgotPassword/Pages/ForgotPassword'),
        ),
      },
      {
        id: 'reset-password',
        path: 'reset-password/:token',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (storedToken) {
            return redirect('/');
          }
          
          return true;
        },
        Component: lazy(
          () => import('./apps/ForgotPassword/Pages/ResetPassword'),
        ),
      },
      {
        id: 'home',
        path: '',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }
          
          return true;
        },
        Component: lazy(
          () => import('./apps/Home/Pages/Home'),
        ),
      },
      {
        id: 'create-task',
        path: 'create-task',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }
          
          return true;
        },
        Component: lazy(
          () => import('./apps/Tasks/Pages/CreateTask'),
        ),
      },
      {
        id: 'edit-task',
        path: 'edit-task/:id',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }
          
          return true;
        },
        Component: lazy(
          () => import('./apps/Tasks/Pages/EditTask'),
        ),
      },
      {
        id: 'update-user',
        path: 'update-user',
        loader: () => {
          const storedToken = sessionStorage.getItem('user_token');
          if (!storedToken) {
            return redirect('/login');
          }
          
          return true;
        },
        Component: lazy(
          () => import('./apps/Users/Pages/UserUpdate'),
        ),
      },
    ],
  },
];

const Router = createBrowserRouter(routes);

export default Router;