export interface Candidate {
  id: 'A' | 'B';
  name: string;
  role: string;
  skills: string[];
  experience: string;
  projects: string;
  education: string;
  location?: string;
  highlightMetric?: string;
  presentationStyle?: 'structured' | 'narrative';
  details?: string;
  additionalInfo?: {
    label: string;
    value: string;
  }[];
}

export interface RoundData {
  id: string;
  roundNumber: number;
  title: string;
  role: string;
  context: string;
  decisionQuestion: string;
  educationalPurpose: string;
  availableInformation: string[];
  candidateA: Candidate;
  candidateB: Candidate;
}

export const ROUNDS_DATA: Record<number, RoundData> = {
  1: {
    id: 'round-1',
    roundNumber: 1,
    title: 'Relevant Skills',
    role: 'Junior Software Developer',
    context: 'Evaluate two candidates based on technical capabilities and project experience directly relevant to this software development role.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select for the Junior Software Developer role?',
    educationalPurpose: 'Establish that clear, role-relevant skills provide direct evidence for technical decision-making.',
    availableInformation: ['Programming Languages', 'Technical Projects', 'Direct Internship Experience', 'Core Skills'],
    candidateA: {
      id: 'A',
      name: 'Aarav',
      role: 'Junior Software Developer',
      skills: ['Python', 'JavaScript', 'SQL', 'Git'],
      experience: '6 months internship in web application development and backend services.',
      projects: 'Built an inventory tracking system and REST API handling database persistence.',
      education: 'B.Sc. in Computer Science',
      highlightMetric: 'Role-Relevant Web & Database Focus'
    },
    candidateB: {
      id: 'B',
      name: 'Rohan',
      role: 'Junior Software Developer',
      skills: ['Java', 'C++', 'Docker', 'Linux'],
      experience: '8 months technical apprenticeship focusing on system utilities and scripting.',
      projects: 'Developed a multi-threaded log parsing tool and automated deployment scripts.',
      education: 'B.Eng. in Information Technology',
      highlightMetric: 'Systems Programming & Scripting Focus'
    }
  },

  2: {
    id: 'round-2',
    roundNumber: 2,
    title: 'Educational Background',
    role: 'Junior Cloud Engineer',
    context: 'Both candidates demonstrate comparable cloud fundamentals and project execution, with differing educational institutions.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select for the Junior Cloud Engineer role?',
    educationalPurpose: 'Explore how educational institution background can influence decision-makers even when technical capabilities are comparable.',
    availableInformation: ['Cloud Skills', 'Infrastructure Projects', 'Educational Institution', 'Practical Experience'],
    candidateA: {
      id: 'A',
      name: 'Maya',
      role: 'Junior Cloud Engineer',
      skills: ['AWS', 'Terraform', 'Python', 'Docker'],
      experience: '1 year experience managing containerized microservices and automated CI/CD pipelines.',
      projects: 'Automated cloud infrastructure provisioning, reducing deployment setup time by 40%.',
      education: 'B.Tech in Computer Engineering — Metropolitan Institute of Technology',
      highlightMetric: 'Infrastructure as Code Proficiency'
    },
    candidateB: {
      id: 'B',
      name: 'Ishita',
      role: 'Junior Cloud Engineer',
      skills: ['Azure', 'Kubernetes', 'Go', 'Bash'],
      experience: '1 year experience maintaining cloud infrastructure and cluster health monitoring.',
      projects: 'Configured high-availability Kubernetes clusters with zero-downtime rolling updates.',
      education: 'B.Tech in Information Science — Horizon State University',
      highlightMetric: 'Cluster Orchestration Proficiency'
    }
  },

  3: {
    id: 'round-3',
    roundNumber: 3,
    title: 'Geographic Location',
    role: 'Systems Reliability Specialist',
    context: 'Both candidates possess strong systems engineering credentials, with different geographic locations indicated on their profiles.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select for the Systems Reliability role?',
    educationalPurpose: 'Demonstrate how extraneous geographic information can subtly influence decisions despite equal technical competence.',
    availableInformation: ['Reliability Skills', 'System Monitoring', 'Geographic Location', 'Incident Track Record'],
    candidateA: {
      id: 'A',
      name: 'Kabir',
      role: 'Systems Reliability Specialist',
      location: 'Ahmedabad',
      skills: ['Linux', 'Python', 'Prometheus', 'Grafana', 'Incident Triage'],
      experience: '2 years monitoring distributed systems and maintaining high service availability SLAs.',
      projects: 'Implemented automated alert triage pipelines that reduced mean time to recovery (MTTR).',
      education: 'B.Sc. in Computing & Data Systems',
      highlightMetric: 'Location: Ahmedabad'
    },
    candidateB: {
      id: 'B',
      name: 'Dev',
      role: 'Systems Reliability Specialist',
      location: 'Pune',
      skills: ['Linux', 'Go', 'Datadog', 'Ansible', 'Network Protocols'],
      experience: '2 years overseeing application uptime and load-balancer resilience.',
      projects: 'Built automated health checks and failover scripts maintaining 99.95% system uptime.',
      education: 'B.Sc. in Systems Engineering',
      highlightMetric: 'Location: Pune'
    }
  },

  4: {
    id: 'round-4',
    roundNumber: 4,
    title: 'Candidate Name',
    role: 'Data Platform Engineer',
    context: 'Both candidates present balanced technical expertise and accomplishments, differing primarily in their individual names.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select for the Data Platform role?',
    educationalPurpose: 'Illustrate how personal identifiers such as names can subconsciously trigger human assumptions even with matched credentials.',
    availableInformation: ['Data Pipeline Skills', 'Database Architecture', 'Candidate Identifier', 'Work Portfolio'],
    candidateA: {
      id: 'A',
      name: 'Aarav',
      role: 'Data Platform Engineer',
      skills: ['SQL', 'Python', 'Apache Spark', 'ETL Pipelines', 'PostgreSQL'],
      experience: '1.5 years designing high-throughput data intake pipelines and database schemas.',
      projects: 'Engineered synchronization pipelines processing over 50,000 events per minute.',
      education: 'B.Tech in Software Engineering',
      highlightMetric: 'Data Pipeline Scalability'
    },
    candidateB: {
      id: 'B',
      name: 'Maya',
      role: 'Data Platform Engineer',
      skills: ['SQL', 'Python', 'Apache Kafka', 'Data Modeling', 'Snowflake'],
      experience: '1.5 years building real-time event ingestion pipelines and schema migrations.',
      projects: 'Built real-time streaming pipelines supporting distributed analytical queries.',
      education: 'B.Tech in Computer Science',
      highlightMetric: 'Real-Time Streaming Systems'
    }
  },

  5: {
    id: 'round-5',
    roundNumber: 5,
    title: 'Presentation Style',
    role: 'API Integration Developer',
    context: 'Both candidates have similar underlying qualifications, but choose distinctly different resume presentation styles.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select for the API Integration Developer role?',
    educationalPurpose: 'Explore whether structured technical bullet points versus narrative conversational descriptions influence perceived capability.',
    availableInformation: ['API Development Skills', 'Presentation Format', 'Integration Experience', 'Credentials'],
    candidateA: {
      id: 'A',
      name: 'Nisha',
      role: 'API Integration Developer',
      skills: ['Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'Git'],
      experience: '1.5 years building backend services and third-party API integration gateways.',
      projects: '• Inventory synchronization service • Payment gateway connector • Webhook event dispatch engine',
      education: 'B.Sc. in Computer Science',
      presentationStyle: 'structured',
      details: 'Structured bullet-point format: concise technical specifications, deliverables, and metric-focused highlights.',
      highlightMetric: 'Format: Structured Technical Bullets'
    },
    candidateB: {
      id: 'B',
      name: 'Anaya',
      role: 'API Integration Developer',
      skills: ['Node.js', 'Fastify', 'REST APIs', 'MongoDB', 'Git'],
      experience: '1.5 years developing seamless integrations and collaborative API developer tools.',
      projects: 'Passionate about building clean developer experiences. Led the integration of our partner API suite and connected vital customer workflows with resilient endpoints.',
      education: 'B.Sc. in Software Systems',
      presentationStyle: 'narrative',
      details: 'Narrative summary format: story-driven descriptions, user-centric context, and collaboration-oriented communication.',
      highlightMetric: 'Format: Narrative Summary'
    }
  },

  6: {
    id: 'round-6',
    roundNumber: 6,
    title: 'Relevant vs Irrelevant Information',
    role: 'Backend Developer',
    context: 'Candidates present verified technical evaluations alongside personal preferences and hobbies that are extraneous to technical execution.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select for the Backend Developer role?',
    educationalPurpose: 'Prompt the decision-maker to consciously isolate role-relevant technical metrics from extraneous personal information.',
    availableInformation: ['Backend Skills', 'Assessment Scores', 'Extraneous Personal Preferences', 'Experience'],
    candidateA: {
      id: 'A',
      name: 'Rohan',
      role: 'Backend Developer',
      skills: ['Go', 'PostgreSQL', 'Redis', 'Microservices'],
      experience: '2 years building high-concurrency microservices and database query optimization.',
      projects: 'Redesigned distributed session caching layer, cutting query latency by 35%.',
      education: 'B.Tech in Information Technology',
      highlightMetric: 'Technical Assessment: 91%',
      details: 'Extraneous Details: Enjoys competitive chess & speed cubing. Prefers black coffee. Uses minimalist monochrome desktop themes.'
    },
    candidateB: {
      id: 'B',
      name: 'Kabir',
      role: 'Backend Developer',
      skills: ['Java', 'Spring Boot', 'MySQL', 'RabbitMQ'],
      experience: '2 years developing reliable transactional services and asynchronous message queues.',
      projects: 'Designed event-driven notification architecture processing 200k daily messages.',
      education: 'B.Tech in Computer Science',
      highlightMetric: 'Technical Assessment: 92%',
      details: 'Extraneous Details: Enjoys marathon running & hiking. Prefers matcha green tea. Uses multi-monitor setups with mechanical keyboards.'
    }
  },

  7: {
    id: 'round-7',
    roundNumber: 7,
    title: 'Comprehensive Final Decision',
    role: 'Full Stack Software Developer',
    context: 'A comprehensive candidate comparison incorporating technical assessments, portfolio projects, professional experience, and secondary attributes.',
    decisionQuestion: 'Which candidate do your algorithmic criteria select for the Full Stack Developer position?',
    educationalPurpose: 'Synthesize all dimensions of technical and non-technical candidate data to prepare the decision-maker for the Algorithmic Bias Reveal.',
    availableInformation: ['Full Stack Stack', 'Assessment & Code Review Scores', 'Project Portfolios', 'Community & Secondary Attributes'],
    candidateA: {
      id: 'A',
      name: 'Dev',
      role: 'Full Stack Software Developer',
      location: 'Pune',
      skills: ['TypeScript', 'React', 'Python', 'PostgreSQL', 'AWS'],
      experience: '2.5 years full-stack product development in cross-functional engineering teams.',
      projects: 'Built complete SaaS analytics dashboard with interactive data visualizations and responsive mobile views.',
      education: 'B.S. in Computer Science — State Polytechnic',
      highlightMetric: 'Technical Assessment: 88% • Code Review: 4.8 / 5.0',
      details: 'Location: Pune • Active contributor to open-source UI libraries. Prefers structured asynchronous code reviews and detailed architecture specs.'
    },
    candidateB: {
      id: 'B',
      name: 'Ishita',
      role: 'Full Stack Software Developer',
      location: 'Ahmedabad',
      skills: ['JavaScript', 'Vue.js', 'Node.js', 'MongoDB', 'Docker'],
      experience: '2.5 years full-stack engineering with focus on real-time web applications.',
      projects: 'Created collaborative workspace canvas with WebSockets, live presence indicators, and document synchronization.',
      education: 'B.S. in Software Systems — City Engineering College',
      highlightMetric: 'Technical Assessment: 89% • Code Review: 4.7 / 5.0',
      details: 'Location: Ahmedabad • Mentored junior boot camp graduates. Active participant in community hackathons and engineering meetups.'
    }
  }
};

export const getRoundData = (roundNumber: number): RoundData => {
  const normalized = Math.max(1, Math.min(roundNumber, 7));
  return ROUNDS_DATA[normalized] || ROUNDS_DATA[1];
};
