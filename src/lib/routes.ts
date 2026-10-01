import { findLessonCourse } from './course-catalog';
export const coursePath='/courses/pc-foundations';
export const courseUrl=(id:string)=>`/courses/${id}`;
export const lessonPath=(slug:string)=>`${courseUrl(findLessonCourse(slug)?.id??'pc-foundations')}/lessons/${slug}`;
export const quizPath=(slug:string)=>`${lessonPath(slug)}/quiz`;
