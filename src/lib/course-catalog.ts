import pc from '../../content/courses/pc-foundations/course.json';
import files from '../../content/courses/file-data/course.json';
import web from '../../content/courses/web-foundations/course.json';
import internet from '../../content/courses/internet-foundations/course.json';
import ai from '../../content/courses/ai-foundations/course.json';
import type { Course } from '@/domain/types';

// Only public course metadata is imported here. Answer banks remain server-only.
export const courseCatalog: Course[] = [pc, files, web, internet, ai];
export const findCourse = (id: string) => courseCatalog.find(course => course.id === id);
export const findLessonCourse = (slug: string) => courseCatalog.find(course => course.lessons.some(lesson => lesson.slug === slug));
