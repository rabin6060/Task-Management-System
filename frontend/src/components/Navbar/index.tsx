import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { logout } from '@/api/user';
import axios from 'axios';
import { useUser } from '@/Context/UserContext';


export interface Error {
  message: string;
  status: string;
}

const Header = () => {
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { user, setUser } = useUser();
  console.log(user)
  const handleLogout = async () => {
    try {
      await logout(user?.data?._id);
      localStorage.removeItem('user');
      setUser(null);
      setShow(false)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data);
        }
      }
    }
  };

  return (
    <header className="w-full h-[60px] shadow-md sticky top-0 z-50 bg-slate-200">
      <nav className='sm:w-full max-w-[70%] h-full mx-auto flex items-center justify-between'>
        <Link to={'/'} className='text-3xl font-[900] text-teal-400'>DO_TO_TO...</Link>
        <div className='flex gap-2'>
          {user ? (
            <>
              <div
                className='cursor-pointer relative text-teal-500 text-lg font-[900]'
                onClick={() => setShow(true)}
              >
                {user?.data?.username}
              </div>
              <div
                className={`${show ? 'flex' : 'hidden'} flex-col gap-1 rounded-lg overflow-hidden absolute top-16 z-20 bg-teal-300 py-2 w-[10%]`}
                aria-label="user menu"
              >
                <div
                  onClick={handleLogout}
                  className='hover:bg-white hover:text-teal-500 text-white w-full cursor-pointer px-2'
                >
                  Logout
                </div>
                <div className='hover:bg-white hover:text-teal-500 text-white w-full cursor-pointer px-2'>
                  Account
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to={'/signup'}>
                <Button className='bg-teal-500 hover:bg-purple-500'>Register</Button>
              </Link>
              <Link to={'/login'}>
                <Button className='bg-teal-500 hover:bg-purple-500'>Login</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      {error && <div className="alert alert-error">{error.message}</div>}
    </header>
  );
};

export default Header;
