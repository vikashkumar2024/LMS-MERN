import { ChartBar, SquareLibrary } from 'lucide-react';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex">
      <div className='hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-r-gray-300 dark:border-gray-700 bg-[#f0f0f0] dark:bg-zinc-900 p-5 sticky top-0 h-screen'>
        <div className='mt-20 space-y-5'>
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-2 p-2 rounded ${
              location.pathname === '/admin/dashboard' ? 'bg-gray-200 dark:bg-zinc-800 font-semibold' : ''
            }`}
          >
            <ChartBar size={22} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/course"
            className={`flex items-center gap-2 p-2 rounded ${
              location.pathname === '/admin/courses/coursesId' ? 'bg-gray-200 dark:bg-zinc-800 font-semibold' : ''
            }`}
          >
            <SquareLibrary size={22} />
            <span>Courses</span>
          </Link>
        </div>
      </div>
      <div className='flex-1 md:p-24 p-2'>
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;