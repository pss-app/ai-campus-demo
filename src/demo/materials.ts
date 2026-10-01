import type { Assessment, Lesson } from '@/domain/types';
// Replaced only in the isolated GitHub Pages build. Normal server builds do not bundle answers.
export const materials: Record<string,{lesson:Lesson;bank:Assessment}> = {};
