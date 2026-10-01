import type { ReactNode } from 'react';
import { getCourse } from '@/server/content';
import { CourseSidebar } from '@/components/layout/course-sidebar';
export default async function CourseLayout({children,params}:{children:ReactNode;params:Promise<{courseId:string}>}){
 const course=await getCourse((await params).courseId);
 return <div className="course-layout"><CourseSidebar course={course}/><main className="lesson-main" id="main-content" tabIndex={-1}>{children}</main></div>;
}
