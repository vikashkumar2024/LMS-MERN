import BuycourseButton from '@/components/BuycourseButton';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BadgeInfo, PlayCircle, Lock, Unlock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useGetcourseByidQuery } from '@/features/api/courseapi';
import { useGetPurchaseStatusQuery } from '@/features/api/Purchaseapi';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { data, isLoading, isError, refetch } = useGetcourseByidQuery(courseId);
  const { data: purchaseData, isLoading: isPurchaseLoading } = useGetPurchaseStatusQuery(courseId);

  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    if (purchaseData?.purchased) {
      setIsPurchased(true);
    }
  }, [purchaseData]);

  if (isLoading || isPurchaseLoading) return <div className='text-center mt-20'>Loading...</div>;
  if (isError || !data) return <div className='text-center mt-20 text-red-500'>Failed to load course details.</div>;

  const course = data.course;

  return (
    <div className='mt-20 space-y-8'>
      <div className="bg-gradient-to-r from-[#2D2f31] to-[#3c3e41] text-white shadow-lg">
        <div className='max-w-7xl mx-auto py-10 px-6 md:px-10 space-y-3'>
          <h1 className='font-bold text-3xl md:text-4xl'>{course.title}</h1>
          <p className='text-lg md:text-xl text-gray-300'>{course.subtitle || 'No subtitle provided'}</p>
          <p className='text-sm md:text-base'>Created By <span className='text-[#c0c4fc] underline italic'>{course.creator?.name}</span></p>
          <div className='flex items-center gap-2 text-sm text-gray-400'>
            <BadgeInfo size={16} />
            <p>Last updated {new Date(course.updatedAt).toLocaleDateString()}</p>
          </div>
          <p className='text-sm'>Students enrolled: {course.enrolledStudents.length}</p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-6'>
        <div className='w-full lg:w-2/3 space-y-6'>
          <div className='space-y-2'>
            <h2 className='font-bold text-2xl text-gray-800 dark:text-white'>Description</h2>
            <p className='text-gray-700 dark:text-gray-300'>{course.description || 'No description available.'}</p>
          </div>

          <div className='border rounded-lg shadow-md bg-white dark:bg-gray-900'>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>{course.lectures.length} lecture(s)</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {course.lectures.length > 0 ? (
                course.lectures.map((lec, idx) => (
                  <div key={lec._id || idx} className='flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200'>
                    <span>
                      {lec.isPreviewFree ? (
                        <PlayCircle size={16} className="text-green-600" />
                      ) : isPurchased ? (
                        <Unlock size={16} className="text-blue-600" />
                      ) : (
                        <Lock size={16} className="text-red-500" />
                      )}
                    </span>
                    <p>{lec.lectureTitle}</p>
                  </div>
                ))
              ) : (
                <p className='text-gray-500'>No lectures available yet.</p>
              )}
            </CardContent>
          </div>
        </div>

        <div className='w-full lg:w-1/3'>
          <div className='border rounded-lg shadow-md bg-white dark:bg-gray-900'>
            <CardContent className='p-4 flex flex-col'>
              <div className='w-full aspect-video mb-4 rounded overflow-hidden shadow'>
                {course.introVideo ? (
                  <ReactPlayer url={course.introVideo} controls width="100%" height="100%" />
                ) : (
                  <div className='bg-gray-200 w-full h-full flex items-center justify-center text-gray-500'>No preview available</div>
                )}
              </div>
              <h1 className='font-semibold text-base'>{course.lectures[0]?.lectureTitle || 'No lecture title'}</h1>
              <Separator className="my-2" />
              <h2 className='text-lg md:text-xl font-semibold text-primary'>₹{course.coursePrice}</h2>
            </CardContent>
            <CardFooter className='flex justify-center p-4'>
              <BuycourseButton courseId={courseId} isPurchased={isPurchased} setIsPurchased={setIsPurchased} />
            </CardFooter>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;