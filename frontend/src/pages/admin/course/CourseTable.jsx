import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetAllcreatorCoursesQuery } from '@/features/api/courseapi'

const CourseTable = () => {
  const { data, isLoading, error } = useGetAllcreatorCoursesQuery()
  const navigate = useNavigate()

  if (isLoading) return <h1>Loading...</h1>
  if (error) return <h1>Error loading courses.</h1>
  if (!data?.courses?.length) return <h2>No courses found.</h2>

  return (
    <div>
      <Button onClick={() => navigate('create')}>Create a new course</Button>
      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id || course.courseId}>
              <TableCell className="font-medium">
                {course?.coursePrice || 'na'}
              </TableCell>
              <TableCell>
                <Badge>{course.isPublished ? 'Published' : 'Draft'}</Badge>
              </TableCell>
              <TableCell>{course.title}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate(`/admin/course/${course._id || course.courseId}`)}
                  title="Edit"
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>{/* Add totals or pagination here if needed */}</TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default CourseTable