export const ROUND_TIME_LIMIT = 30; // 30 seconds classroom-friendly countdown
export const TOTAL_ROUNDS = 5; // Exactly 5 candidate selection decision rounds
export const TOTAL_CANDIDATE_ROUNDS = 5; // Semantic alias for candidate selection phase

export interface Candidate {
  id: 'A' | 'B';
  name: string;
  role: string;
  skills: string[]; // 3-4 items max, shown inline
  experience: string; // 1 short sentence
  projects?: string; // 1-2 short project names
  education?: string; // Shown only when relevant to the round
  location?: string; // Shown only when relevant to the round
  highlightMetric?: string; // Short score/tag when relevant
  details?: string; // Concise round-specific factor
  presentationStyle?: 'structured' | 'narrative';
}

export interface RoundData {
  id: string;
  roundNumber: number;
  title: string;
  role: string;
  context: string;
  decisionQuestion: string;
  educationalPurpose: string;
  candidateA: Candidate;
  candidateB: Candidate;
}

export const ROUNDS_DATA: Record<number, RoundData> = {
  // Round 1 — Skills: Relevant technical skills, experience, projects
  1: {
    id: 'round-1',
    roundNumber: 1,
    title: 'Skills',
    role: 'Junior Developer',
    context: 'Evaluate candidates on technical capabilities directly related to this role.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Show that clearly relevant information can help a decision.',
    candidateA: {
      id: 'A',
      name: 'Aarav',
      role: 'Junior Developer',
      skills: ['Python', 'SQL', 'React', 'Git'],
      experience: '6-month web development internship',
      projects: 'Inventory App · REST API'
    },
    candidateB: {
      id: 'B',
      name: 'Rohan',
      role: 'Junior Developer',
      skills: ['Java', 'C++', 'Docker', 'Linux'],
      experience: '8-month systems apprenticeship',
      projects: 'Log Parser · Deploy Script'
    }
  },

  // Round 2 — Education: Show Skills, Experience, Education (Institution)
  2: {
    id: 'round-2',
    roundNumber: 2,
    title: 'Education',
    role: 'Cloud Engineer',
    context: 'Both candidates demonstrate comparable cloud experience with different colleges.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Show how educational information can influence a decision and introduce the idea of deciding which information is actually relevant.',
    candidateA: {
      id: 'A',
      name: 'Maya',
      role: 'Cloud Engineer',
      skills: ['AWS', 'Terraform', 'Docker', 'Python'],
      experience: '1 year managing cloud containers',
      education: 'Apex Technical University'
    },
    candidateB: {
      id: 'B',
      name: 'Ishita',
      role: 'Cloud Engineer',
      skills: ['Azure', 'Kubernetes', 'Docker', 'Go'],
      experience: '1 year maintaining cloud infrastructure',
      education: 'Metro Polytechnic College'
    }
  },

  // Round 3 — Location: Show Skills, Experience, Location
  3: {
    id: 'round-3',
    roundNumber: 3,
    title: 'Location',
    role: 'Reliability Specialist',
    context: 'Both candidates possess strong reliability skills, differing in geographic city.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Demonstrate that information can influence decisions even when its relevance to the decision is questionable.',
    candidateA: {
      id: 'A',
      name: 'Kabir',
      role: 'Reliability Specialist',
      location: 'Ahmedabad',
      skills: ['Linux', 'Prometheus', 'Grafana', 'Python'],
      experience: '2 years monitoring distributed systems'
    },
    candidateB: {
      id: 'B',
      name: 'Dev',
      role: 'Reliability Specialist',
      location: 'Pune',
      skills: ['Linux', 'Datadog', 'Ansible', 'Go'],
      experience: '2 years overseeing system resilience'
    }
  },

  // Round 4 — Name / Presentation: Candidate identity & presentation layout details
  4: {
    id: 'round-4',
    roundNumber: 4,
    title: 'Name & Presentation',
    role: 'API Developer',
    context: 'Both candidates have similar qualifications, but choose different resume formats and presentation styles.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Explore how candidate identity and presentation details subtly influence perception.',
    candidateA: {
      id: 'A',
      name: 'Nisha',
      role: 'API Developer',
      skills: ['Node.js', 'REST APIs', 'PostgreSQL', 'Git'],
      experience: '1.5 years backend integration',
      projects: '• Inventory API • Webhook service',
      presentationStyle: 'structured',
      details: 'Format: Structured technical bullet points'
    },
    candidateB: {
      id: 'B',
      name: 'Anaya',
      role: 'API Developer',
      skills: ['Node.js', 'REST APIs', 'PostgreSQL', 'Git'],
      experience: '1.5 years backend integration',
      projects: 'Connecting partner APIs and building reliable user endpoints.',
      presentationStyle: 'narrative',
      details: 'Format: Conversational story narrative'
    }
  },

  // Round 5 — Final Decision: Comprehensive multi-factor candidate comparison
  5: {
    id: 'round-5',
    roundNumber: 5,
    title: 'Final Decision',
    role: 'Full Stack Developer',
    context: 'Final multi-factor candidate comparison combining skills, projects, and assessment scores.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Synthesizes multiple candidate dimensions for the final decision, leading directly into the Bias Reveal.',
    candidateA: {
      id: 'A',
      name: 'Dev',
      role: 'Full Stack Developer',
      skills: ['React', 'TypeScript', 'Python', 'AWS'],
      experience: '2.5 years full-stack development',
      projects: 'SaaS Analytics Dashboard',
      highlightMetric: 'Assessment: 88% · Review: 4.8/5'
    },
    candidateB: {
      id: 'B',
      name: 'Ishita',
      role: 'Full Stack Developer',
      skills: ['Vue.js', 'Node.js', 'PostgreSQL', 'Docker'],
      experience: '2.5 years full-stack development',
      projects: 'Real-time Team Canvas',
      highlightMetric: 'Assessment: 89% · Review: 4.7/5'
    }
  }
};

export const getRoundData = (roundNumber: number): RoundData => {
  const normalized = Math.max(1, Math.min(roundNumber, TOTAL_ROUNDS));
  return ROUNDS_DATA[normalized] || ROUNDS_DATA[1];
};
