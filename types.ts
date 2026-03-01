
export interface Experience {
  id: string;
  jobTitle: string;
  employer: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  descriptionType?: 'list' | 'paragraph';
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  location: string;
}

export interface Project {
  id: string;
  title: string;
  link: string;
  description: string;
  technologies: string[];
  descriptionType?: 'list' | 'paragraph';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  level: string; // e.g., Native, Fluent, Intermediate
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  type: 'list' | 'paragraph';
}

export interface ResumeData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  summary: string;
  summaryType?: 'list' | 'paragraph';
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  customSections: CustomSection[];
  templateId: string;
  fontFamily: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  link?: string;
  customGaps: Record<string, number>;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: Array<{ title: string; description: string }>;
}

export const initialResumeState: ResumeData = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  summary: '',
  summaryType: 'paragraph',
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  achievements: [],
  customSections: [],
  templateId: 'tech-design',
  fontFamily: 'Poppins',
  accentColor: '#3b82f6',
  fontSize: 'medium',
  link: '',
  customGaps: {},
};
