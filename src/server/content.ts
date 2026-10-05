import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import { z } from 'zod';
import { notFound } from 'next/navigation';
import { courseCatalog, findCourse, findLessonCourse } from '@/lib/course-catalog';
import type { Assessment, Course, Lesson } from '@/domain/types';

const root=path.join(process.cwd(),'content/courses');
const summary=z.object({id:z.string(),slug:z.string().regex(/^[a-z0-9-]+$/),title:z.string(),order:z.number(),goal:z.string(),objectiveIds:z.array(z.string())});
const courseSchema=z.object({schemaVersion:z.number(),id:z.string(),title:z.string(),description:z.string(),audience:z.string(),version:z.number(),status:z.string(),finalTask:z.object({title:z.string(),description:z.string()}).optional(),lessons:z.array(summary)});
const lessonSchema=z.object({schemaVersion:z.number(),id:z.string(),slug:z.string(),title:z.string(),version:z.number(),goal:z.string(),terms:z.array(z.string()),practice:z.string(),sources:z.array(z.string()),objectives:z.array(z.object({id:z.string(),title:z.string(),keyPoint:z.string(),body:z.array(z.string()),example:z.string(),diagram:z.array(z.string()),codeExample:z.object({label:z.string(),code:z.string()}).optional(),demo:z.enum(['box-model','url-parts']).optional()}))});
const bankSchema=z.object({schemaVersion:z.number(),lessonId:z.string(),lessonVersion:z.number(),questions:z.array(z.object({id:z.string(),version:z.number(),objectiveId:z.string(),objectiveTitle:z.string(),type:z.enum(['single_choice','multiple_choice']),prompt:z.string(),choices:z.array(z.object({id:z.string(),text:z.string()})),correctChoiceIds:z.array(z.string()),explanation:z.string(),hint:z.string(),remediation:z.string(),example:z.string()}))});
async function json(file:string):Promise<unknown>{return JSON.parse(await readFile(file,'utf8'));}
export const getCourse=cache(async(id='pc-foundations'):Promise<Course>=>{
  if(!findCourse(id))notFound();
  return courseSchema.parse(await json(path.join(root,id,'course.json')));
});
export const getCourses=cache(async()=>Promise.all(courseCatalog.map(c=>getCourse(c.id))));
export async function getCourseForLesson(slug:string){const course=findLessonCourse(slug);return course?getCourse(course.id):null;}
export async function getLesson(slug:string):Promise<Lesson|null>{
  const course=await getCourseForLesson(slug);if(!course)return null;
  return lessonSchema.parse(await json(path.join(root,course.id,'lessons',`${slug}.json`)));
}
export async function getAssessment(slug:string):Promise<Assessment|null>{
  const course=await getCourseForLesson(slug);if(!course)return null;
  return bankSchema.parse(await json(path.join(root,course.id,'assessments',`${slug}.json`)));
}

