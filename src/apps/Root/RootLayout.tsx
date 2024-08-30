import { FC, useRef, } from 'react';
import { Outlet, } from 'react-router-dom';

import Navbar from '../Shared/Layout/Navbar';

type RootLayoutProps = object;

const RootLayout: FC<RootLayoutProps> = () => {
  const navbarRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <Navbar ref={navbarRef} />
      <main
        style={{
          position: 'relative',
          top: navbarRef?.current?.clientHeight ?? '70px',
        }} 
        className='min-h-screen '>
        <Outlet/>
      </main>
    </>
  );
};

export default RootLayout;