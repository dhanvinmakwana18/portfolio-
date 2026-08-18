export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'LLMs & GenAI' | 'Computer Vision' | 'Deep Learning';
  description: string;
  longDescription: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  keyFeatures: string[];
  architectureOverview: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  image: string;
  badge: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string;
  highlights: string[];
  skills: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  field: string;
  highlights: string[];
}

export interface CompetencySkill {
  name: string;
  description: string;
  technologies: string[];
  projectId?: string;
}

export interface CompetencyTier {
  id: string;
  label: string;
  title: string;
  theme: 'purple' | 'blue' | 'emerald';
  skills: CompetencySkill[];
}

export interface TechStackCategory {
  category: string;
  iconName: string;
  items: string[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  handle: string;
}
