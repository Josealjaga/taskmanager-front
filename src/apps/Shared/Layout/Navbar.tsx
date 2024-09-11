import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../../public/logo1.png';
import usuario from '../../../../public/usuario.png';

type NavbarProps = object & React.ComponentPropsWithRef<'header'>;

const Navbar: FC<NavbarProps> = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = Boolean(sessionStorage.getItem('user_token'));

  const handleUserIconClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleOptionClick = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('user_token');
    setMenuOpen(false);
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <header className="z-10 w-full h-[80px] bg-gray-100 border-b border-gray-200 fixed top-0 left-0 right-0 shadow-md">
      <div className="w-full h-full flex items-center justify-between max-w-[1620px] mx-auto px-4">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="text-2xl font-primary font-bold"
        >
          <img src={logo} alt="logo" className="h-[200px]" />
        </a>
        <div className="relative">
          <img
            src={usuario}
            alt="usuario"
            className="h-8 cursor-pointer"
            onClick={handleUserIconClick}
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
              {!isAuthenticated ? (
                <>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionClick('/login')}
                  >
                    Iniciar sesión
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionClick('/signup')}
                  >
                    Registrarse
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleOptionClick('/update-user')}
                  >
                    Editar perfil
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Cerrar sesión
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;