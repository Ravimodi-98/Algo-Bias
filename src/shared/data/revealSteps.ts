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
    title: 'Core Technical Skills',
    role: 'Junior Developer',
    candidateAName: 'Aarav Sharma',
    candidateBName: 'Rohan Verma',
    skillsComparison: 'Clearly Different',
    experienceComparison: 'Similar',
    differentiatingFactor: 'Direct framework skill alignment (Python & React vs Java & Linux)',
    factorRelevance: 'Directly Relevant'
  },
  {
    roundNumber: 2,
    title: 'Institutional Background',
    role: 'Cloud Engineer',
    candidateAName: 'Maya Patel',
    candidateBName: 'Ishita Rao',
    skillsComparison: 'Similar',
    experienceComparison: 'Similar',
    differentiatingFactor: 'College pedigree (Apex Technical University vs Metro Polytechnic College)',
    factorRelevance: 'Contextually Less Relevant'
  },
  {
    roundNumber: 3,
    title: 'Geographic Location',
    role: 'Reliability Specialist',
    candidateAName: 'Kabir Mehta',
    candidateBName: 'Dev Malhotra',
    skillsComparison: 'Similar',
    experienceComparison: 'Similar',
    differentiatingFactor: 'Current city (Ahmedabad vs Pune for remote-friendly position)',
    factorRelevance: 'Contextually Less Relevant'
  },
  {
    roundNumber: 4,
    title: 'Identity & Presentation Style',
    role: 'API Developer',
    candidateAName: 'Nisha Gupta',
    candidateBName: 'Anaya Sen',
    skillsComparison: 'Similar',
    experienceComparison: 'Similar',
    differentiatingFactor: 'Resume format (Structured bullet metrics vs Conversational narrative)',
    factorRelevance: 'Format / Presentation'
  },
  {
    roundNumber: 5,
    title: 'Final Decision Comparison',
    role: 'Full Stack Developer',
    candidateAName: 'Dev Malhotra',
    candidateBName: 'Ishita Rao',
    skillsComparison: 'Similar',
    experienceComparison: 'Similar',
    differentiatingFactor: 'Multi-factor combination of framework proficiency, review rating, and assessment score',
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
