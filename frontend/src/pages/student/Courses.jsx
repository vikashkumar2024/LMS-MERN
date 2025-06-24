import React from 'react';
import Course from './Course';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllcreatorCoursesQuery } from '@/features/api/courseapi';

const Courses = () => {
  const { data, isLoading, isError } = useGetAllcreatorCoursesQuery();

  console.log("Courses data:", data);

  const courses = data?.courses || [];

  return (
    <div className='bg-gray-50'>
      <div className='max-w-7xl mx-auto p-6'>
        <h2 className='font-bold text-3xl text-center mb-10'>Your Courses</h2>

        {isError && (
          <p className="text-red-500 text-center mb-4">
            Failed to load courses. Please try again.
          </p>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : courses.map((course) => (
                <Course key={course._id} course={course} />
              ))}
        </div>
      </div>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow'>
      <Skeleton className='w-full h-36' />
      <div className='px-5 py-4 space-y-3'>
        <Skeleton className='h-6 w-3/4' />
        <div className="flex items-center justify-between">
          <div className='flex items-center gap-3'>
            <Skeleton className='h-6 w-6 rounded-full' />
            <Skeleton className='h-4 w-20' />
          </div>
          <Skeleton className='h-4 w-16' />
        </div>
        <Skeleton className='h-4 w-1/4' />
      </div>
    </div>
  );
};

export default Courses;
