export const ROUND_TIME_LIMIT = 30; // 30 seconds classroom-friendly countdown

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
  // Round 1 — Relevant Skills: Focus on skills, experience, projects
  1: {
    id: 'round-1',
    roundNumber: 1,
    title: 'Relevant Skills',
    role: 'Junior Developer',
    context: 'Evaluate candidates on technical capabilities directly related to this role.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Establish that clear, role-relevant skills provide direct evidence for technical decisions.',
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

  // Round 2 — Educational Background: Show Skills, Experience, Education (Institution)
  2: {
    id: 'round-2',
    roundNumber: 2,
    title: 'Educational Background',
    role: 'Cloud Engineer',
    context: 'Both candidates demonstrate comparable cloud experience with different colleges.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Explore how educational institution background can influence decision-makers.',
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
    educationalPurpose: 'Demonstrate how extraneous geographic location can subtly influence decisions.',
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

  // Round 4 — Name: Show Skills, Experience, Candidate Name
  4: {
    id: 'round-4',
    roundNumber: 4,
    title: 'Candidate Name',
    role: 'Data Engineer',
    context: 'Both candidates present identical technical credentials, differing only by name.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Illustrate how personal identifiers can subconsciously trigger human judgment.',
    candidateA: {
      id: 'A',
      name: 'Aarav',
      role: 'Data Engineer',
      skills: ['SQL', 'Python', 'Spark', 'PostgreSQL'],
      experience: '1.5 years building data intake pipelines',
      projects: 'Pipeline Sync Engine'
    },
    candidateB: {
      id: 'B',
      name: 'Maya',
      role: 'Data Engineer',
      skills: ['SQL', 'Python', 'Spark', 'PostgreSQL'],
      experience: '1.5 years building data intake pipelines',
      projects: 'Pipeline Sync Engine'
    }
  },

  // Round 5 — Presentation Style: Show Skills, Experience, Presentation Style
  5: {
    id: 'round-5',
    roundNumber: 5,
    title: 'Presentation Style',
    role: 'API Developer',
    context: 'Both candidates have similar qualifications, but choose different resume formats.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Explore whether bulleted technical facts vs conversational narrative influences perception.',
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
      projects: 'Passionate about connecting partner APIs and building reliable user endpoints.',
      presentationStyle: 'narrative',
      details: 'Format: Conversational story narrative'
    }
  },

  // Round 6 — Relevant vs Irrelevant: Show Skills, Assessment, and 1 Extraneous Fact
  6: {
    id: 'round-6',
    roundNumber: 6,
    title: 'Relevant vs Irrelevant Info',
    role: 'Backend Developer',
    context: 'Technical evaluations are presented alongside extraneous personal hobbies.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Challenge the decision-maker to isolate role-relevant metrics from irrelevant trivia.',
    candidateA: {
      id: 'A',
      name: 'Rohan',
      role: 'Backend Developer',
      skills: ['Go', 'PostgreSQL', 'Redis', 'Docker'],
      experience: '2 years building microservices',
      highlightMetric: 'Assessment: 91%',
      details: 'Extraneous: Competitive chess player'
    },
    candidateB: {
      id: 'B',
      name: 'Kabir',
      role: 'Backend Developer',
      skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
      experience: '2 years building microservices',
      highlightMetric: 'Assessment: 92%',
      details: 'Extraneous: Marathon runner'
    }
  },

  // Round 7 — Final Decision: Comprehensive multi-factor candidate comparison
  7: {
    id: 'round-7',
    roundNumber: 7,
    title: 'Final Decision',
    role: 'Full Stack Developer',
    context: 'Final multi-factor candidate comparison combining skills, projects, and assessment scores.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select?',
    educationalPurpose: 'Synthesizes multiple candidate dimensions to prepare players for the Bias Reveal.',
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
  const normalized = Math.max(1, Math.min(roundNumber, 7));
  return ROUNDS_DATA[normalized] || ROUNDS_DATA[1];
};
