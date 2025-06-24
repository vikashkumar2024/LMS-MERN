import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useGetAllCoursesQuery } from '@/features/api/courseapi';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: coursesData, isLoading } = useGetAllCoursesQuery();

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (coursesData?.courses) {
      const transformedData = coursesData.courses.map((course) => ({
        name: course.title,
        Enrolled: course.enrolledStudents?.length || 0,
        Revenue: (course.enrolledStudents?.length || 0) * (course.coursePrice || 0),
      }));
      setChartData(transformedData);
    }
  }, [coursesData]);

  const totalRevenue = chartData.reduce((sum, item) => sum + item.Revenue, 0);
  const totalEnrollments = chartData.reduce((sum, item) => sum + item.Enrolled, 0);

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 My Course Dashboard</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-600">Total Courses</CardTitle>
            <CardDescription className="text-2xl font-bold text-gray-800">{coursesData?.courses?.length || 0}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-600">Total Enrollments</CardTitle>
            <CardDescription className="text-2xl font-bold text-gray-800">{totalEnrollments}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-600">Total Revenue</CardTitle>
            <CardDescription className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString('en-IN')}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">📈 Course Performance</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Enrolled" fill="#6366f1" radius={[5, 5, 0, 0]} />
              <Bar dataKey="Revenue" fill="#34d399" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
