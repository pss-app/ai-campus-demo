export interface LessonSummary { id: string; slug: string; title: string; order: number; goal: string; objectiveIds: string[] }
export interface Course { schemaVersion: number; id: string; title: string; description: string; audience: string; version: number; status: string; finalTask?: {title:string;description:string}; lessons: LessonSummary[] }
export interface Objective { id: string; title: string; keyPoint: string; body: string[]; example: string; diagram: string[] }
export interface Lesson { schemaVersion: number; id: string; slug: string; title: string; version: number; goal: string; terms: string[]; practice: string; sources: string[]; objectives: Objective[] }
export interface Choice { id: string; text: string }
export interface Question { id: string; version: number; objectiveId: string; objectiveTitle: string; type: 'single_choice' | 'multiple_choice'; prompt: string; choices: Choice[]; correctChoiceIds: string[]; explanation: string; hint: string; remediation: string; example: string }
export interface Assessment { schemaVersion: number; lessonId: string; lessonVersion: number; questions: Question[] }
export interface ItemResult { choiceId: string; selected: boolean; expected: boolean; matched: boolean }
export interface Grade { correct: boolean; itemResults: ItemResult[] }
export interface AttemptRow { questionId: string; questionVersion: number; objectiveId: string; choiceOrder: string[]; selectedChoiceIds: string[]; hintUsed: boolean; supported: boolean; result?: Grade }
export interface Attempt { id: string; lessonId: string; lessonSlug: string; lessonVersion: number; status: 'pending' | 'graded'; startedAt: string; answeredAt?: string; rows: AttemptRow[] }
export interface Confirmation { assisted: boolean; at: string; lessonVersion: number }
export interface LearningSession { schemaVersion: 1; id: string; revision: number; reviewMode: boolean; notes: Record<string,string>; confirmations: Record<string,Confirmation>; attempts: Attempt[]; lastLessonSlug?: string }
export interface PublicQuestion { id: string; objectiveId: string; objectiveTitle: string; type: Question['type']; prompt: string; choices: Choice[]; selectedChoiceIds: string[]; hintUsed: boolean; supported: boolean; hint?: string; result?: Grade; explanation?: string; remediation?: string; example?: string }
export interface PublicAttempt { id: string; lessonSlug: string; status: Attempt['status']; startedAt: string; answeredAt?: string; questions: PublicQuestion[] }
export interface PublicProgress { revision: number; reviewMode: boolean; notes: Record<string,string>; confirmations: Record<string,Confirmation>; lastLessonSlug?: string; records: { attemptId: string; lessonId: string; objectiveId: string; questionId: string; questionVersion: number; lessonVersion: number; presentedChoiceOrder: string[]; selectedChoiceIds: string[]; correct: boolean; hintUsed: boolean; supported: boolean; itemResults: ItemResult[]; presentedAt: string; answeredAt: string }[] }
