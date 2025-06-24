import React, { useEffect } from 'react';
import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useEditcourseMutation, useGetcourseByidQuery, usePublishcourseMutation } from '@/features/api/courseapi';

const CourseTab = () => {
    const params = useParams();
    const courseId = params.courseId;
    const { data: courseByIdData, isLoading: courseByIdLoading } = useGetcourseByidQuery(courseId, { refetchOnMountOrArgChange: true });
    const navigate = useNavigate();
    const [Editcourse, { data, isLoading, isSuccess, error }] = useEditcourseMutation();
    const [publishcourse, { isLoading: isPublishing }] = usePublishcourseMutation();

    const [input, setInput] = React.useState({
        title: '',
        subtitle: '',
        description: '',
        category: '',
        coursePrice: '',
        courseLevel: '',
        courseThumbneil: '',
    });
    const [PreviewThumbnail, setPreviewThumbnail] = React.useState(null);

    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData.course;
            setInput({
                title: course.title,
                subtitle: course.subtitle,
                description: course.description,
                category: course.category,
                coursePrice: course.coursePrice,
                courseLevel: course.courseLevel,
                courseThumbneil: course.courseThumbneil || '',
            });
            setPreviewThumbnail(course.courseThumbneil);
        }
    }, [courseByIdData]);

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
    };

    const selectCategory = (value) => {
        setInput({
            ...input,
            category: value,
        });
    };

    const selectLevel = (value) => {
        setInput({
            ...input,
            courseLevel: value,
        });
    };

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({
                ...input,
                courseThumbneil: file,
            });
            const filereader = new FileReader();
            filereader.onloadend = () => setPreviewThumbnail(filereader.result);
            filereader.readAsDataURL(file);
        }
    };

    const handleDescriptionChange = (desc) => {
        setInput((prev) => ({
            ...prev,
            description: desc,
        }));
    };

    const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append('title', input.title);
        formData.append('subtitle', input.subtitle);
        formData.append('description', input.description);
        formData.append('category', input.category);
        formData.append('coursePrice', input.coursePrice);
        formData.append('courseLevel', input.courseLevel);
        if (input.courseThumbneil instanceof File) {
            formData.append('Thumbnail', input.courseThumbneil);
        } else {
            formData.append('Thumbnail', input.courseThumbneil || '');
        }
        await Editcourse({ formData, courseId });
    };

    const publishStatusHandler = async (publish) => {
        try {
            const response = await publishcourse({ courseId, publish }).unwrap();
            if (response) {
                toast.success(response.message || "Course status updated successfully");
            }
        } catch (error) {
            toast.error("Failed to publish or unpublish course status");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course updated");
        }
        if (error) {
            toast.error(error?.data?.message || "Something went wrong");
        }
    }, [isSuccess, error, data]);

    if (courseByIdLoading) return <h1>Loading...</h1>;

    const isPublished = courseByIdData?.course?.isPublished;

    return (
        <Card>
            <CardHeader className='flex items-center justify-between'>
                <div>
                    <CardTitle>Basic course information</CardTitle>
                    <CardDescription>Make changes to your course here. Click save when you're done.</CardDescription>
                </div>
                <div className='flex gap-2'>
                    <Button
                        variant='outline'
                        onClick={() => publishStatusHandler(!isPublished)}
                        disabled={isPublishing}
                    >
                        {isPublishing
                            ? <Loader2 className='animate-spin mr-2 h-4 w-4' />
                            : isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button>Remove course</Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className='space-y-4 mt-5'>
                    <Label>Title</Label>
                    <Input
                        type='text'
                        name='title'
                        value={input.title}
                        placeholder='Enter your course title'
                        onChange={changeEventHandler}
                    />
                </div>

                <div className='space-y-4 mt-5'>
                    <Label>Subtitle</Label>
                    <Input
                        type='text'
                        name='subtitle'
                        value={input.subtitle}
                        onChange={changeEventHandler}
                        placeholder='Become a fullstack developer from zero to hero'
                    />
                </div>

               <div className='space-y-4 mt-5'>
                <Label>Description</Label>
                <Input
                    type='text'
                    name='description'
                    value={input.description}
                    onChange={(e) =>
                    setInput((prev) => ({
                        ...prev,
                        description: e.target.value,
                    }))
                    }
                    placeholder='Enter a brief description'
                    className='border'
                />
                </div>


                <div className='flex items-center gap-5 mt-5'>
                    <div>
                        <Label>Category</Label>
                        <Select value={input.category} onValueChange={selectCategory}>
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

                    <div>
                        <Label>Course Level</Label>
                        <Select value={input.courseLevel} onValueChange={selectLevel}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a course level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Level</SelectLabel>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Price in (INR)</Label>
                        <Input
                            type='number'
                            name='coursePrice'
                            value={input.coursePrice}
                            onChange={changeEventHandler}
                            placeholder='499'
                            className='w-fit'
                        />
                    </div>
                </div>

                <div className='mt-5'>
                    <Label>Course Thumbnail</Label>
                    <Input
                        type="file"
                        onChange={selectThumbnail}
                        accept='image/*'
                        className="w-fit"
                    />
                    {PreviewThumbnail && typeof PreviewThumbnail === 'string' && (
                        <img
                            src={PreviewThumbnail}
                            alt="Preview"
                            className="h-64 my-2 object-cover"
                        />
                    )}
                </div>

                <div className='flex gap-2 mt-5'>
                    <Button variant='outline' onClick={() => navigate("/admin/course/")}>Cancel</Button>
                    <Button disabled={isLoading} onClick={updateCourseHandler}>
                        {isLoading ? (
                            <>
                                <Loader2 className='animate-spin mr-2 h-4 w-4' />
                                Please wait...
                            </>
                        ) : (
                            'Save changes'
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default CourseTab;
