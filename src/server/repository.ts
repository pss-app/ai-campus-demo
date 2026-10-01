import 'server-only';
import { FileLearningRepository } from './repositories/file-learning-repository';
import type { LearningRepository } from './repositories/learning-repository';

const globals=globalThis as unknown as {learningRepository?:LearningRepository};
export const learningRepository=globals.learningRepository??=new FileLearningRepository();
