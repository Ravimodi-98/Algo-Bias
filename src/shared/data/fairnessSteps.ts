import type { FairnessStepNumber, PriorityLevel } from '../types';

export interface FactorDefinition {
  id: string;
  label: string;
  sample: string;
  category: 'qualification' | 'contextual' | 'unrelated';
  description: string;
}

export interface FairnessStepMeta {
  stepNumber: FairnessStepNumber;
  stageKey: string;
  title: string;
  subtitle: string;
  badge: string;
}

export const FAIRNESS_STEPS_META: FairnessStepMeta[] = [
  {
    stepNumber: 0,
    stageKey: 'ready',
    title: 'MAKE IT FAIR',
    subtitle: 'Challenge Introduction & Readiness',
    badge: 'CHALLENGE LAUNCH'
  },
  {
    stepNumber: 1,
    stageKey: 'factors',
    title: 'CHOOSE RELEVANT INFORMATION',
    subtitle: 'Challenge Round 1 — Which Information Matters?',
    badge: 'ROUND 1: RELEVANCE'
  },
  {
    stepNumber: 2,
    stageKey: 'rule',
    title: 'BUILD YOUR DECISION RULE',
    subtitle: 'Challenge Round 2 — What Should Matter Most?',
    badge: 'ROUND 2: CRITERIA'
  },
  {
    stepNumber: 3,
    stageKey: 'apply',
    title: 'APPLY YOUR RULE',
    subtitle: 'Challenge Round 3 — Candidate Evaluation',
    badge: 'ROUND 3: DECISION'
  },
  {
    stepNumber: 4,
    stageKey: 'fairness_test',
    title: 'FAIRNESS TEST',
    subtitle: 'Test A — Evaluating Unrelated Information',
    badge: 'SYSTEM AUDIT A'
  },
  {
    stepNumber: 5,
    stageKey: 'consistency_test',
    title: 'CONSISTENCY TEST',
    subtitle: 'Testing Robustness Across Irrelevant Variation',
    badge: 'SYSTEM AUDIT B'
  },
  {
    stepNumber: 6,
    stageKey: 'transparency_test',
    title: 'TRANSPARENCY TEST',
    subtitle: 'Can You Explain Why the System Made This Decision?',
    badge: 'SYSTEM AUDIT C'
  },
  {
    stepNumber: 7,
    stageKey: 'human_oversight',
    title: 'HUMAN OVERSIGHT',
    subtitle: 'Should Automated Decisions Be Accepted Without Review?',
    badge: 'SYSTEM AUDIT D'
  },
  {
    stepNumber: 8,
    stageKey: 'results',
    title: 'CLASSROOM CHOICES & PROCESS COMPARISON',
    subtitle: 'Original Approach vs. Designed Approach',
    badge: 'CLASSROOM AGGREGATE'
  },
  {
    stepNumber: 9,
    stageKey: 'reflection',
    title: 'THE KEY REFLECTION',
    subtitle: 'Fairness Is Not a Button',
    badge: 'CASE 9 CONCLUSION'
  }
];

export const CANDIDATE_FACTORS: FactorDefinition[] = [
  {
    id: 'skills',
    label: 'Technical Skills',
    sample: 'Python, SQL, Git',
    category: 'qualification',
    description: 'Direct programming capabilities required for day-to-day software development.'
  },
  {
    id: 'experience',
    label: 'Relevant Experience',
    sample: 'Internship at Software Firm',
    category: 'qualification',
    description: 'Demonstrated experience working in development workflows and teams.'
  },
  {
    id: 'projects',
    label: 'Relevant Projects',
    sample: 'Inventory Management App',
    category: 'qualification',
    description: 'Applied projects proving problem solving and code delivery.'
  },
  {
    id: 'education',
    label: 'Education (When Relevant)',
    sample: 'B.Tech in Computer Science',
    category: 'contextual',
    description: 'Formal computer science coursework; relevance depends on role expectations.'
  },
  {
    id: 'location',
    label: 'Location',
    sample: 'Ahmedabad',
    category: 'contextual',
    description: 'Geographic location. May matter for physical office presence, but does not measure coding ability.'
  },
  {
    id: 'name',
    label: 'Candidate Name',
    sample: 'Alex',
    category: 'unrelated',
    description: 'Personal identifier. Unrelated to job capability.'
  },
  {
    id: 'presentation_style',
    label: 'Presentation Style',
    sample: 'Very confident vocal posture',
    category: 'unrelated',
    description: 'Surface delivery style. Can mask technical gaps or disadvantage qualified candidates.'
  }
];

export const DEFAULT_PRIORITIES: Record<string, PriorityLevel> = {
  skills: 'HIGH',
  experience: 'HIGH',
  projects: 'MEDIUM',
  education: 'MEDIUM',
  location: 'EXCLUDE',
  name: 'EXCLUDE',
  presentation_style: 'EXCLUDE'
};

export const CANDIDATE_APPLICATION_DATA = {
  role: 'Junior Software Developer',
  description: 'Apply your designed decision rule to choose between these two qualified finalists:',
  candidateA: {
    label: 'Candidate A',
    summary: 'Higher Technical Skills',
    attributes: [
      { key: 'Skills', value: 'Strong (Python, SQL, React API integration)' },
      { key: 'Experience', value: 'Medium (1 summer internship)' },
      { key: 'Projects', value: 'Strong (Built full-stack inventory tracker)' }
    ]
  },
  candidateB: {
    label: 'Candidate B',
    summary: 'Higher Practical Experience',
    attributes: [
      { key: 'Skills', value: 'Medium (Python, Basic SQL scripting)' },
      { key: 'Experience', value: 'Strong (2 industry internships + agile experience)' },
      { key: 'Projects', value: 'Strong (Open source library contributor)' }
    ]
  }
};
