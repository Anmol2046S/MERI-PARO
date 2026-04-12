/**
 * humorRegistry.js — All AI personality and humor logic for MERI PARO
 * Edit this file to update Paro's commentary platform-wide.
 * No humor logic should exist anywhere else in the codebase.
 */

// 🧠 HUMOR TRIGGER: Renders only for role === 'HR' || 'MD' || 'admin'
export const getParoTake = ({ resumeScore = 0, cgpa = 0, missingSkills = [], topSkill = '' } = {}) => {
  if (resumeScore >= 85 && cgpa < 7.0) {
    return `This candidate's GPA is a "limited time offer," but their ${topSkill || 'core'} skills are genuinely Silicon Valley Season 3 material. Hire them before someone else does.`;
  }
  if (resumeScore < 60 && cgpa > 8.5) {
    return `Strong GPA. Textbook legend. But this resume has the energy of a LinkedIn post that says "Excited to share..." and then says nothing. The academics are real — the self-presentation needs work.`;
  }
  if (missingSkills.map(s => s.toLowerCase()).includes('sql')) {
    return `Solid frontend instincts. No SQL. They're building the dashboard of a rocket ship and have no idea what fuel is. Full-stack readiness: pending.`;
  }
  if (resumeScore >= 90) {
    return `Paro has reviewed this resume and is choosing to say nothing, because sometimes a 90+ speaks for itself. Schedule the interview.`;
  }
  if (resumeScore >= 70 && missingSkills.length > 3) {
    return `Good foundation, visible gaps. The skills that are present are genuinely useful. The skills that are missing are genuinely common. A 3-month learning sprint fixes this.`;
  }
  if (resumeScore < 45) {
    return `Paro has reviewed this resume and is processing its feelings. The structural formatting alone lowered the score by 8 points. There is potential here — it's just well-hidden.`;
  }
  return `Paro has reviewed this resume. The signals are mixed, the ambition is clear, and the formatting is forgivable. A reasonable candidate worth a closer look.`;
};

// 🧠 HUMOR TRIGGER: Renders only for role === 'HR' || 'MD' || 'admin'
export const getVibeBadge = ({ topSkill = '', resumeScore = 0 } = {}) => {
  // Returns a score out of 10 and a one-line personality read
  let score = 5.0;
  let read = 'Steady. Reliable. Shows up on time.';

  if (resumeScore >= 90) { score = 9.4; read = 'Genuinely intimidating. In a good way.'; }
  else if (resumeScore >= 80) { score = 8.1; read = 'High signal. Low drama. A rare combination.'; }
  else if (resumeScore >= 70) { score = 7.3; read = 'Capable professional. Will probably outlast three reorgs.'; }
  else if (resumeScore >= 60) { score = 6.4; read = 'Has opinions. Not all of them are wrong.'; }
  else if (resumeScore >= 50) { score = 5.8; read = 'In progress. Aggressively in progress.'; }
  else { score = 4.2; read = 'The resume is a draft. So is the career trajectory. Both can be edited.'; }

  if (topSkill?.toLowerCase().includes('python')) score = Math.min(10, score + 0.3);
  if (topSkill?.toLowerCase().includes('react')) score = Math.min(10, score + 0.2);

  return { score: score.toFixed(1), read };
};

// 🧠 HUMOR TRIGGER: Renders only for role === 'HR' || 'MD' || 'admin'
export const getRemoteScore = ({ skills = [] } = {}) => {
  // Derives a "Remote Efficiency Index" from remote-work-adjacent skill signals
  const remoteSignals = [
    'git', 'github', 'jira', 'notion', 'slack', 'docker', 'kubernetes', 'aws',
    'gcp', 'azure', 'figma', 'linux', 'bash', 'typescript', 'api', 'rest', 'graphql',
    'ci/cd', 'agile', 'scrum', 'postgresql', 'mongodb'
  ];
  const normalizedSkills = skills.map(s => s.toLowerCase());
  const matches = remoteSignals.filter(signal =>
    normalizedSkills.some(s => s.includes(signal))
  ).length;
  const raw = Math.min(100, Math.round((matches / remoteSignals.length) * 100 * 1.4));
  return Math.max(10, raw);
};

// Demand metadata for skill tooltips on SkillsPage
export const SKILL_DEMAND_MAP = {
  'Python':     { demand: 'High',   jobs: '12,400' },
  'React':      { demand: 'High',   jobs: '9,800'  },
  'SQL':        { demand: 'High',   jobs: '14,200' },
  'TypeScript': { demand: 'High',   jobs: '8,100'  },
  'Node.js':    { demand: 'High',   jobs: '7,300'  },
  'AWS':        { demand: 'High',   jobs: '11,600' },
  'Docker':     { demand: 'Medium', jobs: '5,400'  },
  'Kubernetes': { demand: 'Medium', jobs: '4,100'  },
  'Java':       { demand: 'High',   jobs: '10,900' },
  'Go':         { demand: 'Medium', jobs: '3,200'  },
  'Rust':       { demand: 'Low',    jobs: '1,100'  },
  'MongoDB':    { demand: 'Medium', jobs: '4,600'  },
  'GraphQL':    { demand: 'Medium', jobs: '2,900'  },
  'Figma':      { demand: 'Medium', jobs: '3,700'  },
  'Flutter':    { demand: 'Medium', jobs: '2,400'  },
  'Django':     { demand: 'Medium', jobs: '3,100'  },
  'FastAPI':    { demand: 'Medium', jobs: '2,200'  },
};

export const getSkillDemand = (skillName = '') => {
  const key = Object.keys(SKILL_DEMAND_MAP).find(
    k => k.toLowerCase() === skillName.toLowerCase()
  );
  return key ? SKILL_DEMAND_MAP[key] : { demand: 'Emerging', jobs: '1,000+' };
};
