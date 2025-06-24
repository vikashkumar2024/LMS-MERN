import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import LectureTab from './LectureTab'

const Editlecture = () => {
    const { courseId, lectureId } = useParams();
    
    return (
        <div>
            <div className='flex items-center justify-between mb-5'>
                <div className='flex items-center gap-2'>
                    <Link to={`/admin/course/${courseId}/lecture/${lectureId}`} className='flex items-center gap-2'>
                        <Button size='icon' variant='outline' className='rounded-full'>
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    <h1 className='font-bold text-xl ml-2'>update your lecture</h1>
                </div>
            </div>
            <LectureTab />
        </div>
    )
}

export default Editlecture