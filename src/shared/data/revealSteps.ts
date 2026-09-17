import type { RevealStepData } from '../types';

export interface RoundComparisonFact {
  roundNumber: number;
  title: string;
  role: string;
  candidateAName: string;
  candidateBName: string;
  skillsComparison: 'Similar' | 'Clearly Different' | 'Mixed';
  experienceComparison: 'Similar' | 'Different';
  differentiatingFactor: string;
  factorRelevance: 'Directly Relevant' | 'Contextually Less Relevant' | 'Format / Presentation';
}

export const ROUND_COMPARISON_FACTS: RoundComparisonFact[] = [
  {
    roundNumber: 1,
    title: 'Core Technical Qualifications',
    role: 'Frontend Engineer',
    candidateAName: 'Aarav Sharma',
    candidateBName: 'Rohan Verma',
    skillsComparison: 'Clearly Different',
    experienceComparison: 'Similar',
    differentiatingFactor: 'Direct framework skill alignment (React & TypeScript vs unrelated stack)',
    factorRelevance: 'Directly Relevant'
  },
  {
    roundNumber: 2,
    title: 'Institutional Background',
    role: 'Data Analyst',
    candidateAName: 'Maya Patel',
    candidateBName: 'Ishita Rao',
    skillsComparison: 'Similar',
    experienceComparison: 'Similar',
    differentiatingFactor: 'College pedigree (IIT Bombay vs State University)',
    factorRelevance: 'Contextually Less Relevant'
  },
  {
    roundNumber: 3,
    title: 'Geographic Location',
    role: 'Cloud Architect',
    candidateAName: 'Kabir Mehta',
    candidateBName: 'Dev Malhotra',
    skillsComparison: 'Similar',
    experienceComparison: 'Similar',
    differentiatingFactor: 'Current city (Ahmedabad vs Pune for a remote-first position)',
    factorRelevance: 'Contextually Less Relevant'
  },
  {
    roundNumber: 4,
    title: 'Identity & Perceived Background',
    role: 'Machine Learning Engineer',
    candidateAName: 'Aarav Sharma',
    candidateBName: 'Maya Patel',
    skillsComparison: 'Similar',
    experienceComparison: 'Similar',
    differentiatingFactor: 'Applicant identity / candidate name on identical qualifications',
    factorRelevance: 'Contextually Less Relevant'
  },
  {
    roundNumber: 5,
    title: 'Resume Presentation Style',
    role: 'Product Manager',
    candidateAName: 'Nisha Gupta',
    candidateBName: 'Anaya Sen',
    skillsComparison: 'Similar',
    experienceComparison: 'Similar',
    differentiatingFactor: 'Visual resume layout (Structured metrics vs Narrative style)',
    factorRelevance: 'Format / Presentation'
  },
  {
    roundNumber: 6,
    title: 'Relevant vs Irrelevant Attribute Mix',
    role: 'Full Stack Developer',
    candidateAName: 'Rohan Verma',
    candidateBName: 'Kabir Mehta',
    skillsComparison: 'Mixed',
    experienceComparison: 'Similar',
    differentiatingFactor: 'Mix of extracurricular hobbies alongside technical competencies',
    factorRelevance: 'Contextually Less Relevant'
  },
  {
    roundNumber: 7,
    title: 'Final Synthetic Profile',
    role: 'DevOps Specialist',
    candidateAName: 'Dev Malhotra',
    candidateBName: 'Ishita Rao',
    skillsComparison: 'Similar',
    experienceComparison: 'Similar',
    differentiatingFactor: 'Subtle contextual clues embedded in background summary',
    factorRelevance: 'Contextually Less Relevant'
  }
];

export const REVEAL_STEPS: RevealStepData[] = [
  {
    stepNumber: 1,
    title: 'The Pause',
    subtitle: 'Something interesting happened',
    section: 'INTRO'
  },
  {
    stepNumber: 2,
    title: 'Classroom Decisions',
    subtitle: 'How the group decided across scenarios',
    section: 'DATA_REVIEW'
  },
  {
    stepNumber: 3,
    title: 'What Changed?',
    subtitle: 'Examining candidate attributes across rounds',
    section: 'FACTORS'
  },
  {
    stepNumber: 4,
    title: 'Relevant vs. Less-Relevant Information',
    subtitle: 'Distinguishing decision criteria',
    section: 'FACTORS'
  },
  {
    stepNumber: 5,
    title: 'The Key Question',
    subtitle: 'Did the information influence the decision?',
    section: 'QUESTION'
  },
  {
    stepNumber: 6,
    title: 'Decisions Become Data',
    subtitle: 'Understanding the impact of scale',
    section: 'SCALE'
  },
  {
    stepNumber: 7,
    title: 'The Algorithm',
    subtitle: 'How systems learn and reproduce patterns',
    section: 'ALGORITHM'
  },
  {
    stepNumber: 8,
    title: 'Impact & Automation ≠ Fairness',
    subtitle: 'Why automated decisions are not automatically fair',
    section: 'IMPACT'
  },
  {
    stepNumber: 9,
    title: 'Toward Responsible Design',
    subtitle: 'So what can we do?',
    section: 'NEXT_STEPS'
  }
];
