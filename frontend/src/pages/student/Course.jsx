import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Course = ({ course }) => {
  if (!course) return null;

  return (
    <Link to={`course-details/${course._id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className='relative'>
          <img
            src={course?.courseThumbneil}
            alt={course?.title}
            className='w-full h-36 object-cover rounded-t-lg'
          />
        </div>
        <CardContent className='px-5 py-4 space-y-3'>
          <h1 className='hover:underline font-bold text-lg truncate'>
            {course?.title}
          </h1>

          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-8 w-8'>
                <AvatarImage
                  src={"https://api.dicebear.com/7.x/initials/svg?seed=" + course?.category}
                  alt={course?.category}
                />
                <AvatarFallback>{course?.category[0]}</AvatarFallback>
              </Avatar>
              <span className='font-medium text-sm'>{course?.category}</span>
            </div>
            <Badge className='bg-blue-600 text-white px-2 py-1 text-xs rounded-full'>
              {course?.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>

          <div className='text-sm text-muted-foreground'>
            Lectures: {course?.lectures?.length || 0}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
