// FIX: Removed file content delimiters (e.g., --- START OF FILE ---) that were causing compilation errors.
import type { ReactElement } from 'react';

export enum UserRole {
  NONE = 'None',
  STUDENT = 'تلميذ',
  TEACHER = 'أستاذ',
  ADMIN = 'إداري',
  PARENT = 'ولي أمر',
}

export enum ContentStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  LOCKED = 'locked',
}

export enum LearningStyle {
  VISUAL = 'بصري',
  AUDITORY = 'سمعي',
  KINESTHETIC = 'حركي',
  GENERAL = 'عام',
}

export enum LessonContentType {
    VIDEO = 'video',
    PDF = 'pdf',
    PRESENTATION = 'presentation',
}

export interface LessonContent {
    type: LessonContentType;
    url: string;
}

export interface Comment {
    id: string;
    authorName: string;
    text: string;
    date: string; // ISO String
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  reminder?: Date;
  comments: Comment[];
  content?: LessonContent;
}

export interface Exercise {
  id:string;
  title: string;
  description: string;
  status: ContentStatus;
  reminder?: Date;
  comments: Comment[];
}

export interface Subject {
  id: string;
  name: string;
  // Fix: Use ReactElement to avoid JSX namespace error in a .ts file.
  // FIX: Specify that the icon accepts a className prop to fix type errors with React.cloneElement.
  icon: ReactElement<{ className?: string }>;
  color: string;
  progress: number;
  lessons: Lesson[];
  exercises: Exercise[];
  quizzes: Quiz[];
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverImage: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

export interface Grade {
    subject: string;
    grade: number;
}

export enum AttendanceStatus {
    PRESENT = 'present',
    ABSENT = 'absent',
}

export interface AttendanceRecord {
    date: string; // YYYY-MM-DD
    status: AttendanceStatus;
}

export interface Attendance {
    present: number;
    absent: number;
}

export interface SubjectProgress {
    subjectName: string;
    progress: number; // Percentage from 0 to 100
}

export interface Observation {
    id: string;
    text: string;
    date: string; // ISO String
}

export interface StudentNote {
    id: string;
    text: string;
    date: string; // ISO String
}

export interface CustomField {
    id: string;
    label: string;
    value: string;
}

export interface Student {
    id: string;
    name: string;
    parentId?: string;
    grades: Grade[];
    attendance: Attendance;
    attendanceRecords: AttendanceRecord[];
    activities: string[];
    notes: StudentNote[];
    observations: Observation[];
    progress: SubjectProgress[];
    customFields: CustomField[];
}

export enum MaterialType {
    PDF = 'PDF',
    PRESENTATION = 'Presentation',
    DOCUMENT = 'Document',
    VIDEO = 'Video',
}

export interface CourseMaterial {
    id: string;
    name: string;
    type: MaterialType;
    url: string; 
}

export interface AnswerOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export enum QuestionType {
    MULTIPLE_CHOICE = 'Multiple Choice',
    TRUE_FALSE = 'True/False',
    SHORT_ANSWER = 'Short Answer',
}

export interface QuizQuestion {
    id: string;
    questionText: string;
    type: QuestionType;
    options?: AnswerOption[];
    correctAnswer?: string; // For short answer
}

export interface Quiz {
    id: string;
    title: string;
    questions: QuizQuestion[];
}

export interface SchoolClass {
    id: string;
    name: string;
    students: Student[];
    materials: CourseMaterial[];
    quizzes: Quiz[];
    lessons: Lesson[];
    exercises: Exercise[];
}

export interface Notification {
    id: string;
    message: string;
    date: string;
    read: boolean;
}

export interface ManagedUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
    childIds?: string[];
    notifications?: Notification[];
}

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    dueDate?: string; // YYYY-MM-DD
}

export interface SchoolStats {
    totalStudents: number;
    totalTeachers: number;

    totalParents: number;
    totalClasses: number;
}

export interface SystemConfig {
    schoolName: string;
    academicYear: string;
    parentPortalEnabled: boolean;
    maintenanceMode: boolean;
}