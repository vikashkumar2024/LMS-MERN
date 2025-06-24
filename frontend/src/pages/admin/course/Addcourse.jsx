import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useCreateCourseMutation } from '@/features/api/courseapi';
import { toast } from 'sonner';

const Addcourse = () => {
  const navigate = useNavigate();
  const [title, settitle] = useState('');
  const [category, setcategory] = useState('');

  const [createCourse, { data, isLoading, error, isSuccess }] = useCreateCourseMutation();

  const getSelectedCategory = (value) => {
    setcategory(value);
  };

  const createCourseHandler = async () => {
  if (!title || !category) {
    toast.warning("Please fill in both title and category.");
    return;
  }

  await createCourse({ title, category }).unwrap()
    .then(() => {
      navigate('/admin/Course');
    })
    .catch((err) => {
      toast.error(err?.data?.message || 'Failed to create course');
    });
};

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || 'Course created successfully');
    } else if (error) {
      toast.error('Failed to create course');
    }
  }, [isSuccess, error]);

  return (
    <div>
      <div className="flex-1 mx-10">
        <div className="mb-4">
          <h1 className="font-bold text-xl">
            Let's add a course — basic details
          </h1>
          <p className="text-sm">
            Please provide a title and category for the new course.
          </p>
        </div>
      </div>
      <div className="space-y-4 mx-10">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="Next js">Next js</SelectItem>
                <SelectItem value="MernStack">MernStack</SelectItem>
                <SelectItem value="Data science">Data science</SelectItem>
                <SelectItem value="React">React</SelectItem>
                <SelectItem value="Springboot">Springboot</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/Course')}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Create Course'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Addcourse;
