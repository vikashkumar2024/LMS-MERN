import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import CourseTab from './CourseTab'

const Editcourse = () => {
  return (
    <div className='flex-1'>
        <div className="flex items-center justify-between mb-5">
        <h1 className='font-bold text-xl'>
            Add details information
        </h1>
       <Link to='lecture'>
       <Button className='hover:text-blue-600' variant='link'>Go to lecture pages</Button>
       </Link>
        </div>
        <CourseTab/>
    </div>
  )
}

export default Editcourse