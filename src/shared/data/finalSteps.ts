import type { FinalStepNumber } from '../types';

export interface FinalStepMeta {
  stepNumber: FinalStepNumber;
  title: string;
  subtitle: string;
  badge: string;
}

export const FINAL_STEPS_META: FinalStepMeta[] = [
  {
    stepNumber: 0,
    title: 'FINAL CLASSROOM RESULTS',
    subtitle: 'Classroom Collective Metrics & Process Redesign',
    badge: 'CLASSROOM METRICS'
  },
  {
    stepNumber: 1,
    title: 'WHAT DID WE LEARN?',
    subtitle: 'Five Key Principles of Algorithmic Systems',
    badge: 'KEY LESSONS'
  },
  {
    stepNumber: 2,
    title: 'THE COMPLETE CHAIN',
    subtitle: 'Fairness Across the Whole Pipeline',
    badge: 'SYSTEM PIPELINE'
  },
  {
    stepNumber: 3,
    title: 'AUTOMATION ≠ FAIRNESS',
    subtitle: 'The Four Pillars of Responsible Design',
    badge: 'FINAL THESIS'
  },
  {
    stepNumber: 4,
    title: 'CLASSROOM REFLECTION',
    subtitle: 'Personal Takeaways & Final Discussion',
    badge: 'ETHICAL REFLECTION'
  },
  {
    stepNumber: 5,
    title: 'SIMULATION COMPLETE',
    subtitle: 'Session Conclusion & Acknowledgments',
    badge: 'GAME COMPLETE'
  }
];

export interface EducationalLesson {
  id: number;
  title: string;
  tagline: string;
  description: string;
  iconType: 'info' | 'relevance' | 'data' | 'testing' | 'accountability';
}

export const EDUCATIONAL_LESSONS: EducationalLesson[] = [
  {
    id: 1,
    title: 'INFORMATION MATTERS',
    tagline: 'Framing Shapes Human Perception',
    description: 'The information we receive can directly influence the decisions we make. Surface presentation, ordering, and irrelevant labels sway evaluation when left unchecked.',
    iconType: 'info'
  },
  {
    id: 2,
    title: 'RELEVANCE MATTERS',
    tagline: 'Context Determines What Counts',
    description: 'Information should have a meaningful, demonstrable connection to the decision. Qualifications matter for job roles; personal identity markers do not.',
    iconType: 'relevance'
  },
  {
    id: 3,
    title: 'DATA MATTERS',
    tagline: 'Decisions Today Become Training Data Tomorrow',
    description: 'Human decisions can become recorded data, and patterns in data directly train algorithms. Unexamined human bias scales into algorithmic bias.',
    iconType: 'data'
  },
  {
    id: 4,
    title: 'TESTING MATTERS',
    tagline: 'Fairness Must Be Verified, Not Assumed',
    description: 'A decision system should be actively tested rather than simply assumed to be fair. Auditing for consistency and robustness exposes hidden flaws.',
    iconType: 'testing'
  },
  {
    id: 5,
    title: 'ACCOUNTABILITY MATTERS',
    tagline: 'Humans Remain Responsible for Outcomes',
    description: 'Automated systems can support decisions, but institutional accountability still belongs to people. Automation cannot be used to outsource moral responsibility.',
    iconType: 'accountability'
  }
];

export const REFLECTION_THEMES = [
  {
    id: 'data_used',
    label: 'What data is being used?',
    description: 'Asking what data sources and attributes feed into the decision.'
  },
  {
    id: 'info_matters',
    label: 'What information actually matters?',
    description: 'Questioning whether the collected factors have a legitimate connection.'
  },
  {
    id: 'system_tested',
    label: 'How was the system tested?',
    description: 'Demanding proof of audits, consistency checks, and stress tests.'
  },
  {
    id: 'decision_explained',
    label: 'Can the decision be explained?',
    description: 'Insisting on transparency, interpretability, and clear reasoning.'
  },
  {
    id: 'who_accountable',
    label: 'Who is accountable?',
    description: 'Identifying the humans and institutions responsible for systemic harm.'
  }
];

export const FINAL_DISCUSSION_PROMPT = {
  question: 'IF AN ALGORITHM MAKES A DECISION FOR US...',
  subtext: 'WHO IS RESPONSIBLE FOR MAKING SURE IT IS FAIR?',
  guidance: 'Open the floor for classroom dialogue. There is no single universal formula — accountability involves developers, leadership, regulators, and users.'
};
