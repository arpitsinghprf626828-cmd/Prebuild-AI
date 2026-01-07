
export interface StartupInput {
  problem: string;
  targetUsers: string;
  existingSolutions: string;
  uniqueness: string;
  revenueModel: string;
  feasibility: string;
  scalability: string;
  longTermVision: string;
}

export type Verdict = 'GO' | 'PIVOT' | 'NO-GO';

export interface CategoryRating {
  category: string;
  score: number;
}

export interface Competitor {
  name: string;
  url: string;
}

export interface DetailPoint {
  title: string;
  detail: string;
}

export interface EvaluationResult {
  overallScore: number;
  ratings: CategoryRating[];
  strengths: DetailPoint[];
  weaknesses: DetailPoint[];
  suggestions: DetailPoint[];
  decision: Verdict;
  executiveSummary: string;
  competitors: Competitor[];
  brandImageUrl?: string;
}

export const QUESTIONS = [
  { id: 'problem', label: 'What problem are you solving?', placeholder: 'Describe the specific pain point your startup addresses...' },
  { id: 'targetUsers', label: 'Who are your target users?', placeholder: 'Describe your ideal customer segments...' },
  { id: 'existingSolutions', label: 'What are the existing solutions?', placeholder: 'How do people solve this problem today?' },
  { id: 'uniqueness', label: 'What is your unique value proposition?', placeholder: 'What makes your solution better than competitors?' },
  { id: 'revenueModel', label: 'How will you make money?', placeholder: 'Describe your pricing or monetization strategy...' },
  { id: 'feasibility', label: 'Is this technically and operationally feasible?', placeholder: 'Can you actually build this with current resources?' },
  { id: 'scalability', label: 'How scalable is this business?', placeholder: 'How easily can the business grow without costs scaling linearly...' },
  { id: 'longTermVision', label: 'What is your long-term vision?', placeholder: 'Where do you see this in 5-10 years?' },
];

export interface SampleItem extends StartupInput {
  title: string;
  icon: string;
  tagline: string;
}

export const SAMPLES: Record<string, SampleItem> = {
  green_campus: {
    title: 'EcoDining IoT',
    icon: '🌱',
    tagline: 'AI-powered food waste reduction for campus halls.',
    problem: 'University dining halls waste up to 30% of prepared food daily due to inaccurate demand forecasting and lack of real-time monitoring.',
    targetUsers: 'University dining hall administrators and sustainability directors at large educational institutions.',
    existingSolutions: 'Manual waste logging and high-level inventory guesswork based on historical enrollment numbers.',
    uniqueness: 'IoT-enabled trash bin scales integrated with computer vision to identify and quantify specific food waste patterns in real-time.',
    revenueModel: 'B2B SaaS. Annual licensing fee per facility ($15,000/year) based on projected food cost savings.',
    feasibility: 'High. Uses existing weight sensors and off-the-shelf camera hardware with specialized AI classification software.',
    scalability: 'Very High. Can expand from universities to corporate cafeterias, hospitals, and stadium food services.',
    longTermVision: 'To become the global standard for industrial food waste intelligence and circular economy analytics.'
  },
  mind_mate: {
    title: 'MindBridge AI',
    icon: '🧠',
    tagline: '24/7 AI-first mental health support for students.',
    problem: 'Campus counseling centers have wait times of 4-6 weeks, while 60% of students report overwhelming anxiety during peak exam seasons.',
    targetUsers: 'College students suffering from high stress/anxiety who need immediate, low-barrier emotional support.',
    existingSolutions: 'University counseling (slow), crisis hotlines (intimidating), or meditation apps (non-interactive).',
    uniqueness: 'An AI companion trained specifically on peer-reviewed student-centric CBT (Cognitive Behavioral Therapy) frameworks with automated triage to human specialists.',
    revenueModel: 'SaaS for universities. Charging per student per month to provide auxiliary support and reduce counseling load.',
    feasibility: 'Moderate. Requires high clinical guardrails and HIPPA-compliant data handling, but the technology (LLMs) is ready.',
    scalability: 'Extreme. Once trained, the AI can support millions of concurrent users with zero marginal cost increase.',
    longTermVision: 'The primary entry point for global student mental health, providing predictive triage and early intervention.'
  },
  degree_verify: {
    title: 'EduTrust',
    icon: '⛓️',
    tagline: 'Blockchain-verified academic credentials.',
    problem: 'Credential fraud is rising, and verifying university degrees takes employers 2-4 weeks of manual background checking.',
    targetUsers: 'HR departments at tech companies and universities issuing international degrees.',
    existingSolutions: 'Manual email verification, transcript services (National Student Clearinghouse), or centralized databases.',
    uniqueness: 'A decentralized protocol that allows universities to "mint" degrees as tamper-proof digital assets that students own and share instantly.',
    revenueModel: 'Transaction fee charged to employers for instant, guaranteed verification of a candidate\'s credentials.',
    feasibility: 'High. Utilizes established blockchain technology (Polygon/Ethereum) for low-cost, secure data anchoring.',
    scalability: 'High. Network effects driven: as more universities join, the value to employers increases exponentially.',
    longTermVision: 'The global LinkedIn-integrated layer for all verified human achievement and professional certifications.'
  },
  solo_safe: {
    title: 'CampusGuard',
    icon: '🛡️',
    tagline: 'Predictive safety routing for solo commuters.',
    problem: 'Students feel unsafe walking across campus or to off-campus housing at night, leading to high stress and safety incidents.',
    targetUsers: 'Commuter students and those living in urban campus environments who frequently travel alone after dark.',
    existingSolutions: 'Campus blue-light phones, "Share My Location" on WhatsApp, or expensive private security escorts.',
    uniqueness: 'Predictive heat-mapping that suggests the safest (most well-lit and populated) walking routes based on real-time campus data.',
    revenueModel: 'Freemium for students. Premium "Response" tier ($2.99/mo) with instant emergency services dispatch and safe-zone tracking.',
    feasibility: 'High. Uses standard GPS routing with additional data layers for street lighting and foot traffic patterns.',
    scalability: 'High. Can be localized to any city or campus globally with public safety data API integrations.',
    longTermVision: 'A global personal safety layer that makes every city walkable and safe for everyone.'
  },
  skill_swap: {
    title: 'SkillLink',
    icon: '🔄',
    tagline: 'Zero-cash skill exchange for student makers.',
    problem: 'Students have valuable skills (design, code, writing) but no budget to hire help for their own projects or startups.',
    targetUsers: 'Student entrepreneurs, developers, and designers who need collaborative help without capital.',
    existingSolutions: 'Upwork/Fiverr (too expensive), or asking friends (unreliable and limited scope).',
    uniqueness: 'A "Time-Bank" ledger where 1 hour of coding earns you 1 credit you can spend on 1 hour of professional video editing.',
    revenueModel: 'Platform subscription for "Business Teams" and a small transaction fee for "buying" extra credits to bridge gaps.',
    feasibility: 'Very High. A standard social matching platform with a virtual currency ledger.',
    scalability: 'High. Minimal operational overhead; growth is driven by the internal economy of the user base.',
    longTermVision: 'The primary alternative economy for the world\'s 200M+ students to build and launch products together.'
  },
  ai_study: {
    title: 'StudyBud AI',
    icon: '📚',
    tagline: 'AI matching for niche study partners.',
    problem: 'College students often struggle to find study partners for niche courses or during odd hours, leading to isolation and lower grades.',
    targetUsers: 'University students, particularly those in STEM or distance learning programs who need collaborative peer support.',
    existingSolutions: 'General Discord servers, abandoned WhatsApp groups, or physically going to the library.',
    uniqueness: 'An AI-powered matching engine that scans course syllabi to match students based on specific study topics and learning styles.',
    revenueModel: 'Freemium model. Pro tier ($4.99/mo) offers unlimited matches and AI-generated summary notes.',
    feasibility: 'High. Uses existing social matching algorithms integrated with LLMs for syllabus parsing.',
    scalability: 'Very High. Network effects drive value.',
    longTermVision: 'To become the global social infrastructure for peer-to-peer academic collaboration.'
  }
};
