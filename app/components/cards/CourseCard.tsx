import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { icons } from '../icons/icons';
import { Course } from '@/app/types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
      {course.thumbnail && (
        <div className="aspect-video overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {course.category}
          </span>
          <span className="text-sm text-muted-foreground">
            {course.level}
          </span>
        </div>
        
        <h3 className="mb-2 text-lg font-semibold leading-tight">
          <Link href={`/courses/${course.id}`} className="hover:underline">
            {course.title}
          </Link>
        </h3>
        
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`${
                    i < Math.floor(course.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  {icons.star}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({course.rating})
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">
              ${course.price}
            </div>
            <div className="text-xs text-muted-foreground">
              {course.enrolledStudents} students
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {Math.floor(course.duration / 60)}h {course.duration % 60}m
          </span>
          <Button size="sm" className="w-full">
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 