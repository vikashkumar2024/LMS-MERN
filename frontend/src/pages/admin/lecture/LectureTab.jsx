import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React, { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEditLectureMutation, useGetLectureByIdQuery, useRemovelectureMutation } from '@/features/api/courseapi';
import { Loader2 } from 'lucide-react';

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
    const [lectureTitle, setLectureTitle] = useState('');
    const [videoInfo, setVideoInfo] = useState(null);
    const [isPreviewFree, setIsPreviewFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [uploadedFileName, setUploadedFileName] = useState('');

    const { courseId, lectureId } = useParams();
    const {data:lectureData}=useGetLectureByIdQuery(lectureId);
    const lecture=lectureData?.lecture;
    useEffect(()=>{
        if(lecture){
            setLectureTitle(lecture.lectureTitle);
            setIsPreviewFree(lecture.isPreviewFree);
            setVideoInfo(lecture.videoInfo);
        
        }
    },[lecture])
    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
    const [removelecture, {
        data: removeData,
        isLoading: removeLoading,
        isSuccess: removeSuccess,
        error: removeError
    }] = useRemovelectureMutation();

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFileName(file.name);
            const formData = new FormData();
            formData.append("file", file);
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total));
                    }
                });
                if (res.data.success) {
                    setVideoInfo({
                        videoUrl: res.data.data.url,
                        publicId: res.data.data.public_id,
                    });
                    setBtnDisabled(false);
                    toast.success(res.data.message);
                }
            } catch (error) {
                toast.error('Video upload failed');
            } finally {
                setMediaProgress(false);
            }
        }
    };

    const editLectureHandler = async () => {
        try {
            await editLecture({
                lectureTitle,
                videoInfo,
                isPreviewFree,
                courseId,
                lectureId,
            }).unwrap();
            toast.success("Lecture updated successfully!");
            setBtnDisabled(true);
            setUploadProgress(0);
        } catch (err) {
            toast.error(err?.data?.message || "Something went wrong");
        }
    };

    const removeLectureHandler = async () => {
        try {
            await removelecture({ lectureId }).unwrap();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to remove lecture");
        }
    };

    useEffect(() => {
        if (isSuccess && data) {
            toast.success(data.message);
        }
        if (error) {
            toast.error(error.data?.message);
        }
    }, [isSuccess, error, data]);

    useEffect(() => {
        setBtnDisabled(!(lectureTitle || videoInfo));
    }, [lectureTitle, videoInfo]);

    useEffect(() => {
        if (removeSuccess && removeData?.message) {
            toast.success(removeData.message);
        }
        if (removeError) {
            toast.error(removeError.data?.message || "Failed to remove lecture");
        }
    }, [removeSuccess, removeData, removeError]);

    return (
        <Card>
            <CardHeader className='flex justify-between'>
                <div>
                    <CardTitle>Edit lecture</CardTitle>
                    <CardDescription>Make changes and click save when done.</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant="destructive" onClick={removeLectureHandler} disabled={removeLoading}>
                        {removeLoading ?<>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                        please wait...
                        </>:"remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <input
                        type="text"
                        value={lectureTitle}
                        onChange={e => setLectureTitle(e.target.value)}
                        placeholder='Enter your lecture title'
                        className='w-full border rounded-md p-2 mt-2'
                    />
                </div>
                <div className='my-5'>
                    <Label>Video <span className='text-red-500'>*</span></Label>
                    <input
                        type="file"
                        accept='video/*'
                        onChange={fileChangeHandler}
                        placeholder='Enter your lecture video'
                        className='w-fit'
                    />
                    {uploadedFileName && (
                        <div className="text-xs mt-1 text-gray-500">Selected: {uploadedFileName}</div>
                    )}
                </div>
                <div className="flex items-center space-x-2 my-5">
                    <Switch id="is-preview-free" checked={isPreviewFree} onCheckedChange={setIsPreviewFree} />
                    <Label htmlFor="is-preview-free">Is this video free?</Label>
                </div>
                {mediaProgress && (
                    <div className='my-4'>
                        <progress value={uploadProgress} max={100} />
                        <p>{uploadProgress}% uploaded</p>
                    </div>
                )}
                <div className='mt-4'>
                    <Button onClick={editLectureHandler} disabled={btnDisabled || isLoading}>
                        {isLoading ? "Updating..." : "Update Lecture"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LectureTab;
