import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Course from './Course';
import { useGetEnrolledCoursesQuery } from '@/features/api/courseapi';

const MyLearning = () => {
  const { data, isLoading, isError } = useGetEnrolledCoursesQuery();

  const courses = data?.courses || [];

  return (
    <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
      <h1 className='font-bold text-2xl mb-6'>My Learning</h1>

      {isLoading ? (
        <MyLearningSkeleton />
      ) : isError ? (
        <p className='text-red-500'>Failed to load enrolled courses.</p>
      ) : courses.length === 0 ? (
        <p className='text-gray-500'>You are not enrolled in any course yet.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {courses.map((course) => (
            <Course key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLearning;

const MyLearningSkeleton = () => (
  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
    {Array.from({ length: 6 }).map((_, index) => (
      <Skeleton key={index} className='h-40 w-full rounded-lg' />
    ))}
  </div>
);
