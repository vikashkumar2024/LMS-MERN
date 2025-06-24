import React, { useEffect } from 'react';
import { Menu, School } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from './ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import Darkmode from '@/Darkmode';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from './ui/sheet';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLogoutUserMutation, useLoadUserQuery } from '@/features/api/authapi';

export const Navbar = () => {
  const navigate = useNavigate();
  const [logoutUser, { isSuccess }] = useLogoutUserMutation();
  const { data } = useLoadUserQuery();

  const user = data?.user || null;

  const logoutHandler = () => {
    logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out");
      navigate("/login");
    }
  }, [isSuccess, data, navigate]);

  return (
    <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
      {/* Desktop Navbar */}
      <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4'>
        <div className='flex items-center gap-2'>
          <Link
            to="/"
            className="flex items-center gap-3 text-gray-800 hover:text-blue-700 transition-all duration-200"
          >
            <School size={32} className="text-blue-600 drop-shadow-md" />
            <h1 className="font-extrabold text-3xl tracking-tight">S<span className="text-blue-600">-Learning</span></h1>
          </Link>
        </div>

        <div className='flex items-center gap-8'>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user.photoUrl || ''} alt={user.name || 'User'} />
                  <AvatarFallback>{user.name ? user.name[0] : 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to='/dashboard'>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to='/my-learning'>My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to='/profile'>Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Logout
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='flex items-center gap-2'>
              <Button variant='outline' onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <Darkmode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className='flex md:hidden items-center justify-between px-4 h-full'>
        <h1 className='font-extrabold text-2xl'>S-learning</h1>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

export default Navbar;

// Mobile Navbar with Dashboard link
const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' className='rounded-full bg-gray-200 hover:bg-gray-300' variant='outline'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className='grid gap-4 py-4'>
          {user ? (
            <>
              <Button variant="ghost" className="justify-start" onClick={() => navigate('/dashboard')}>Dashboard</Button>
              <Button variant="ghost" className="justify-start" onClick={() => navigate('/my-learning')}>My Learning</Button>
              <Button variant="ghost" className="justify-start" onClick={() => navigate('/profile')}>Edit Profile</Button>
              <Button variant="ghost" className="justify-start" onClick={logoutHandler}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant='outline' onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </>
          )}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type='button'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};