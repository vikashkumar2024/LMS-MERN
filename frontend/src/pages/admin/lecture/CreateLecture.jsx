// ...existing code...
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseapi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Lecture from './Lecture';
// ...existing code...

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState('');
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [
    createLecture,
    {
      isLoading: isCreating,
      isError: isCreateError,
      isSuccess: isCreateSuccess,
      error: createError,
      data: createData,
    },
  ] = useCreateLectureMutation();

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  const { data: lectureData, isLoading: lectureLoading, isError: lecturerror, refetch } = useGetCourseLectureQuery(courseId);

  useEffect(() => {
    if (isCreateSuccess && createData) {
      refetch();
      toast.success(createData.message || 'Lecture created successfully!');
      navigate(`/admin/course/${courseId}/lecture`, { replace: true });
    }
    if (isCreateError && createError) {
      toast.error(createError.data?.message || 'Failed to create lecture');
    }
  }, [isCreateSuccess, isCreateError, createData, createError, navigate, courseId]);

  return (
    <div>
      <div className="flex-1 mx-10">
        <div className="mb-4">
          <h1 className="font-bold text-xl">Let's add a Lecture — basic details</h1>
          <p className="text-sm">Please provide a title and category for the new Lecture.</p>
        </div>
      </div>
      <div className="space-y-4 mx-10">
        <div>
          <Label htmlFor="lectureTitle">Title</Label>
          <Input
            id="lectureTitle"
            type="text"
            placeholder="Enter lecture title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>
            Back to course
          </Button>
          <Button disabled={isCreating} onClick={createLectureHandler}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Create lecture'
            )}
          </Button>
        </div>
        <div className='mt-10'>
          {
            lectureLoading ? (<p>loading lecture..</p>)
              : lecturerror ? (<p>failed to load lecture</p>)
                : lectureData?.lectures?.length === 0 ? <p>no lecture found</p> :
                  lectureData?.lectures?.map((lecture, index) => (
                    <Lecture key={index} courseId={courseId} lecture={lecture} index={index}/>
                  ))
          }
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
// ...existing code...