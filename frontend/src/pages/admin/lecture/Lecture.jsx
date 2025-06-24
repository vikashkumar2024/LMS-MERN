import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();

  const goToUpdateLecture = () => {
    navigate(`/admin/course/${courseId}/lecture/${lecture._id}`);
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 dark:bg-zinc-900 px-6 py-4 rounded-2xl shadow-sm mb-3">
      <h1 className="font-semibold text-lg text-gray-800 dark:text-white">
        Lecture {index + 1}: {lecture.lectureTitle}
      </h1>
      <Edit
        onClick={goToUpdateLecture}
        size={22}
        className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
      />
    </div>
  );
};

export default Lecture;