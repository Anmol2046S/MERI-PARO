USE meri_paro;

-- =============================================
-- SEED SKILLS
-- =============================================
INSERT INTO skills (name, category, demand_score) VALUES
-- Programming Languages
('Python', 'programming', 95.00),
('JavaScript', 'programming', 94.00),
('TypeScript', 'programming', 88.00),
('Java', 'programming', 85.00),
('C++', 'programming', 75.00),
('C#', 'programming', 78.00),
('Go', 'programming', 80.00),
('Rust', 'programming', 72.00),
('PHP', 'programming', 60.00),
('Ruby', 'programming', 55.00),
('Swift', 'programming', 65.00),
('Kotlin', 'programming', 70.00),
('R', 'programming', 68.00),
('Scala', 'programming', 62.00),
('SQL', 'programming', 90.00),
-- Frameworks
('React', 'framework', 93.00),
('Angular', 'framework', 78.00),
('Vue.js', 'framework', 75.00),
('Node.js', 'framework', 90.00),
('Express.js', 'framework', 85.00),
('Django', 'framework', 80.00),
('Flask', 'framework', 75.00),
('FastAPI', 'framework', 78.00),
('Spring Boot', 'framework', 82.00),
('Next.js', 'framework', 85.00),
('.NET', 'framework', 80.00),
('TailwindCSS', 'framework', 82.00),
('Bootstrap', 'framework', 65.00),
('jQuery', 'framework', 45.00),
('Laravel', 'framework', 65.00),
('Ruby on Rails', 'framework', 55.00),
('TensorFlow', 'framework', 88.00),
('PyTorch', 'framework', 90.00),
('Scikit-learn', 'framework', 85.00),
-- Databases
('MySQL', 'database', 85.00),
('PostgreSQL', 'database', 88.00),
('MongoDB', 'database', 82.00),
('Redis', 'database', 78.00),
('Elasticsearch', 'database', 75.00),
('DynamoDB', 'database', 72.00),
('Firebase', 'database', 70.00),
('SQLite', 'database', 60.00),
('Oracle', 'database', 65.00),
('Cassandra', 'database', 68.00),
-- Cloud
('AWS', 'cloud', 92.00),
('Azure', 'cloud', 85.00),
('Google Cloud', 'cloud', 83.00),
('Heroku', 'cloud', 55.00),
('Vercel', 'cloud', 70.00),
('Netlify', 'cloud', 65.00),
-- DevOps
('Docker', 'devops', 90.00),
('Kubernetes', 'devops', 85.00),
('Jenkins', 'devops', 72.00),
('GitHub Actions', 'devops', 78.00),
('Terraform', 'devops', 80.00),
('Ansible', 'devops', 68.00),
('CI/CD', 'devops', 85.00),
('Linux', 'devops', 82.00),
('Nginx', 'devops', 70.00),
('Git', 'devops', 92.00),
-- Design
('Figma', 'design', 80.00),
('Adobe XD', 'design', 65.00),
('Sketch', 'design', 55.00),
('UI/UX Design', 'design', 82.00),
('Photoshop', 'design', 60.00),
-- Soft Skills
('Problem Solving', 'soft_skill', 90.00),
('Communication', 'soft_skill', 88.00),
('Leadership', 'soft_skill', 85.00),
('Team Collaboration', 'soft_skill', 87.00),
('Project Management', 'soft_skill', 82.00),
('Agile', 'soft_skill', 80.00),
('Scrum', 'soft_skill', 75.00),
('Critical Thinking', 'soft_skill', 85.00),
-- Tools
('JIRA', 'tool', 72.00),
('Postman', 'tool', 70.00),
('VS Code', 'tool', 60.00),
('Webpack', 'tool', 65.00),
('GraphQL', 'tool', 75.00),
('REST API', 'tool', 88.00),
('Microservices', 'tool', 82.00),
('Machine Learning', 'tool', 90.00),
('Deep Learning', 'tool', 88.00),
('NLP', 'tool', 85.00),
('Computer Vision', 'tool', 80.00),
('Data Analysis', 'tool', 85.00),
('Power BI', 'tool', 70.00),
('Tableau', 'tool', 72.00),
('Excel', 'tool', 60.00)
ON DUPLICATE KEY UPDATE demand_score = VALUES(demand_score);

-- =============================================
-- SEED JOB ROLES
-- =============================================
INSERT INTO job_roles (title, slug, description, required_skills, optional_skills, avg_salary_min, avg_salary_max, demand_level, experience_level, industry) VALUES
('Full Stack Developer', 'full-stack-developer', 'Professional Full Stack Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["Git", "CSS", "HTML", "Problem Solving"]',
 '["AWS", "Docker", "CI/CD"]',
 52000, 143000, 'medium', 'mid', 'Technology'),

('Frontend Developer', 'frontend-developer', 'Professional Frontend Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["Git", "CSS", "HTML", "Problem Solving"]',
 '["AWS", "Docker", "CI/CD"]',
 50000, 150000, 'high', 'entry', 'Technology'),

('Backend Developer', 'backend-developer', 'Professional Backend Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["Node.js", "CSS", "HTML", "Git", "REST API", "Problem Solving", "SQL"]',
 '["AWS", "Docker", "CI/CD"]',
 57000, 152000, 'very_high', 'entry', 'Technology'),

('React Developer', 'react-developer', 'Professional React Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["React", "CSS", "HTML", "Git", "Problem Solving", "JavaScript"]',
 '["AWS", "Docker", "CI/CD"]',
 54000, 145000, 'medium', 'senior', 'Technology'),

('Angular Developer', 'angular-developer', 'Professional Angular Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["CSS", "HTML", "TypeScript", "Git", "Angular", "Problem Solving", "JavaScript"]',
 '["AWS", "Docker", "CI/CD"]',
 59000, 150000, 'high', 'senior', 'Technology'),

('Vue.js Developer', 'vuejs-developer', 'Professional Vue.js Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["CSS", "HTML", "Git", "Vue.js", "Problem Solving", "JavaScript"]',
 '["AWS", "Docker", "CI/CD"]',
 56000, 146000, 'very_high', 'senior', 'Technology'),

('Node.js Developer', 'nodejs-developer', 'Professional Node.js Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["Node.js", "CSS", "HTML", "Git", "REST API", "Problem Solving", "SQL"]',
 '["AWS", "Docker", "CI/CD"]',
 55000, 160000, 'medium', 'senior', 'Technology'),

('PHP Developer', 'php-developer', 'Professional PHP Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["CSS", "HTML", "PHP", "MySQL", "Git", "Problem Solving"]',
 '["AWS", "Docker", "CI/CD"]',
 51000, 158000, 'very_high', 'mid', 'Technology'),

('Ruby on Rails Developer', 'ruby-on-rails-developer', 'Professional Ruby on Rails Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["Git", "CSS", "HTML", "Problem Solving"]',
 '["AWS", "Docker", "CI/CD"]',
 50000, 149000, 'high', 'senior', 'Technology'),

('Python Web Developer', 'python-web-developer', 'Professional Python Web Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["Python", "CSS", "HTML", "Git", "Django", "Problem Solving", "SQL"]',
 '["AWS", "Docker", "CI/CD"]',
 53000, 150000, 'high', 'mid', 'Technology'),

('Django Developer', 'django-developer', 'Professional Django Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["Python", "CSS", "HTML", "Git", "Django", "Problem Solving", "SQL"]',
 '["AWS", "Docker", "CI/CD"]',
 51000, 153000, 'high', 'entry', 'Technology'),

('Go Developer', 'go-developer', 'Professional Go Developer specializing in Web Development. Responsible for building and maintaining top-tier solutions.',
 '["Git", "CSS", "HTML", "Problem Solving"]',
 '["AWS", "Docker", "CI/CD"]',
 58000, 155000, 'high', 'mid', 'Technology'),

('Mobile Developer', 'mobile-developer', 'Professional Mobile Developer specializing in Mobile Development. Responsible for building and maintaining top-tier solutions.',
 '["Kotlin", "Git", "REST API", "Problem Solving", "Swift", "JavaScript"]',
 '["Firebase", "GraphQL", "CI/CD"]',
 58000, 158000, 'very_high', 'senior', 'Technology'),

('iOS Developer', 'ios-developer', 'Professional iOS Developer specializing in Mobile Development. Responsible for building and maintaining top-tier solutions.',
 '["Git", "REST API", "Swift", "Problem Solving"]',
 '["Firebase", "GraphQL", "CI/CD"]',
 54000, 141000, 'high', 'senior', 'Technology'),

('Android Developer', 'android-developer', 'Professional Android Developer specializing in Mobile Development. Responsible for building and maintaining top-tier solutions.',
 '["Kotlin", "Git", "REST API", "Problem Solving"]',
 '["Firebase", "GraphQL", "CI/CD"]',
 54000, 150000, 'very_high', 'senior', 'Technology'),

('Flutter Developer', 'flutter-developer', 'Professional Flutter Developer specializing in Mobile Development. Responsible for building and maintaining top-tier solutions.',
 '["Git", "REST API", "JavaScript", "Problem Solving"]',
 '["Firebase", "GraphQL", "CI/CD"]',
 56000, 147000, 'very_high', 'entry', 'Technology'),

('React Native Developer', 'react-native-developer', 'Professional React Native Developer specializing in Mobile Development. Responsible for building and maintaining top-tier solutions.',
 '["React", "Git", "REST API", "Problem Solving", "JavaScript"]',
 '["Firebase", "GraphQL", "CI/CD"]',
 59000, 145000, 'medium', 'senior', 'Technology'),

('Swift Developer', 'swift-developer', 'Professional Swift Developer specializing in Mobile Development. Responsible for building and maintaining top-tier solutions.',
 '["Git", "REST API", "Swift", "Problem Solving"]',
 '["Firebase", "GraphQL", "CI/CD"]',
 52000, 157000, 'high', 'mid', 'Technology'),

('Kotlin Developer', 'kotlin-developer', 'Professional Kotlin Developer specializing in Mobile Development. Responsible for building and maintaining top-tier solutions.',
 '["Kotlin", "Git", "REST API", "Problem Solving"]',
 '["Firebase", "GraphQL", "CI/CD"]',
 56000, 144000, 'medium', 'senior', 'Technology'),

('Mobile Architect', 'mobile-architect', 'Professional Mobile Architect specializing in Mobile Development. Responsible for building and maintaining top-tier solutions.',
 '["Kotlin", "REST API", "Problem Solving", "Swift", "JavaScript"]',
 '["Firebase", "GraphQL", "CI/CD"]',
 53000, 145000, 'very_high', 'mid', 'Technology'),

('Data Scientist', 'data-scientist', 'Professional Data Scientist specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Machine Learning", "Python", "Problem Solving", "Data Analysis", "SQL", "Scikit-learn"]',
 '["TensorFlow", "AWS", "Deep Learning", "PyTorch"]',
 83000, 200000, 'medium', 'entry', 'Technology'),

('Data Analyst', 'data-analyst', 'Professional Data Analyst specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Data Analysis", "Python", "SQL", "Problem Solving"]',
 '["Power BI", "Excel", "Tableau"]',
 85000, 183000, 'medium', 'entry', 'Technology'),

('Data Engineer', 'data-engineer', 'Professional Data Engineer specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Python", "Git", "Problem Solving", "Data Analysis", "SQL"]',
 '[]',
 88000, 180000, 'high', 'entry', 'Technology'),

('Business Intelligence Analyst', 'business-intelligence-analyst', 'Professional Business Intelligence Analyst specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Data Analysis", "Python", "SQL", "Problem Solving"]',
 '["Power BI", "Excel", "Tableau"]',
 80000, 186000, 'very_high', 'entry', 'Technology'),

('Machine Learning Engineer', 'machine-learning-engineer', 'Professional Machine Learning Engineer specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Machine Learning", "Python", "Git", "Problem Solving", "Data Analysis", "SQL", "Scikit-learn"]',
 '["TensorFlow", "AWS", "Deep Learning", "PyTorch"]',
 81000, 186000, 'high', 'entry', 'Technology'),

('Deep Learning Engineer', 'deep-learning-engineer', 'Professional Deep Learning Engineer specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Python", "Git", "Problem Solving", "Data Analysis", "SQL"]',
 '[]',
 87000, 180000, 'very_high', 'entry', 'Technology'),

('NLP Engineer', 'nlp-engineer', 'Professional NLP Engineer specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Python", "Git", "Problem Solving", "Data Analysis", "SQL"]',
 '[]',
 90000, 187000, 'medium', 'senior', 'Technology'),

('Computer Vision Engineer', 'computer-vision-engineer', 'Professional Computer Vision Engineer specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Python", "Git", "Problem Solving", "Data Analysis", "SQL"]',
 '[]',
 85000, 194000, 'very_high', 'senior', 'Technology'),

('AI Engineer', 'ai-engineer', 'Professional AI Engineer specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Machine Learning", "Python", "Git", "Problem Solving", "Data Analysis", "SQL", "Scikit-learn"]',
 '["TensorFlow", "AWS", "Deep Learning", "PyTorch"]',
 82000, 189000, 'medium', 'senior', 'Technology'),

('Big Data Engineer', 'big-data-engineer', 'Professional Big Data Engineer specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Python", "Git", "Problem Solving", "Data Analysis", "SQL"]',
 '[]',
 89000, 182000, 'very_high', 'mid', 'Technology'),

('Data Analytics Manager', 'data-analytics-manager', 'Professional Data Analytics Manager specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Data Analysis", "Python", "SQL", "Problem Solving"]',
 '[]',
 83000, 188000, 'medium', 'entry', 'Technology'),

('Data Architect', 'data-architect', 'Professional Data Architect specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Data Analysis", "Python", "SQL", "Problem Solving"]',
 '[]',
 83000, 198000, 'medium', 'entry', 'Technology'),

('Quantitative Analyst', 'quantitative-analyst', 'Professional Quantitative Analyst specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Data Analysis", "Python", "SQL", "Problem Solving"]',
 '["Power BI", "Excel", "Tableau"]',
 89000, 183000, 'high', 'senior', 'Technology'),

('Marketing Data Analyst', 'marketing-data-analyst', 'Professional Marketing Data Analyst specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Data Analysis", "Python", "SQL", "Problem Solving"]',
 '["Power BI", "Excel", "Tableau"]',
 87000, 189000, 'medium', 'entry', 'Technology'),

('Predictive Modeler', 'predictive-modeler', 'Professional Predictive Modeler specializing in Data & Analytics. Responsible for building and maintaining top-tier solutions.',
 '["Data Analysis", "Python", "SQL", "Problem Solving"]',
 '[]',
 90000, 193000, 'very_high', 'entry', 'Technology'),

('DevOps Engineer', 'devops-engineer', 'Professional DevOps Engineer specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Jenkins", "Git", "Docker", "Linux", "Problem Solving", "CI/CD"]',
 '["Scripting", "Azure", "Google Cloud"]',
 82000, 180000, 'medium', 'mid', 'Technology'),

('Cloud Architect', 'cloud-architect', 'Professional Cloud Architect specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Docker", "Linux", "Problem Solving", "Kubernetes", "Terraform"]',
 '["Scripting", "Azure", "Google Cloud"]',
 81000, 198000, 'very_high', 'senior', 'Technology'),

('Cloud Engineer', 'cloud-engineer', 'Professional Cloud Engineer specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Git", "Docker", "Linux", "Problem Solving"]',
 '["Scripting", "Azure", "Google Cloud"]',
 82000, 192000, 'medium', 'mid', 'Technology'),

('Site Reliability Engineer', 'site-reliability-engineer', 'Professional Site Reliability Engineer specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Git", "Docker", "Linux", "Problem Solving"]',
 '["Scripting", "Azure", "Google Cloud"]',
 81000, 199000, 'very_high', 'entry', 'Technology'),

('AWS Solutions Architect', 'aws-solutions-architect', 'Professional AWS Solutions Architect specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Docker", "Linux", "Problem Solving", "Kubernetes", "Terraform"]',
 '["Scripting", "Azure", "Google Cloud"]',
 80000, 195000, 'high', 'mid', 'Technology'),

('Azure Cloud Engineer', 'azure-cloud-engineer', 'Professional Azure Cloud Engineer specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Git", "Docker", "Linux", "Problem Solving"]',
 '["Scripting", "Azure", "Google Cloud"]',
 82000, 195000, 'very_high', 'entry', 'Technology'),

('GCP Engineer', 'gcp-engineer', 'Professional GCP Engineer specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Git", "Docker", "Linux", "Problem Solving"]',
 '["Scripting", "Azure", "Google Cloud"]',
 81000, 188000, 'very_high', 'senior', 'Technology'),

('Infrastructure Engineer', 'infrastructure-engineer', 'Professional Infrastructure Engineer specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Git", "Docker", "Linux", "Problem Solving"]',
 '["Scripting", "Azure", "Google Cloud"]',
 89000, 193000, 'medium', 'entry', 'Technology'),

('Platform Engineer', 'platform-engineer', 'Professional Platform Engineer specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Git", "Docker", "Linux", "Problem Solving"]',
 '["Scripting", "Azure", "Google Cloud"]',
 89000, 189000, 'very_high', 'mid', 'Technology'),

('Kubernetes Administrator', 'kubernetes-administrator', 'Professional Kubernetes Administrator specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Docker", "Linux", "Problem Solving", "Kubernetes", "Terraform"]',
 '["Scripting", "Azure", "Google Cloud"]',
 85000, 188000, 'very_high', 'senior', 'Technology'),

('Build Engineer', 'build-engineer', 'Professional Build Engineer specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Git", "Docker", "Linux", "Problem Solving"]',
 '["Scripting", "Azure", "Google Cloud"]',
 80000, 197000, 'medium', 'entry', 'Technology'),

('Release Manager', 'release-manager', 'Professional Release Manager specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Docker", "Linux", "Problem Solving"]',
 '["Scripting", "Azure", "Google Cloud"]',
 81000, 192000, 'high', 'entry', 'Technology'),

('Network Engineer', 'network-engineer', 'Professional Network Engineer specializing in Cloud & Infrastructure. Responsible for building and maintaining top-tier solutions.',
 '["AWS", "Git", "Docker", "Linux", "Problem Solving"]',
 '["Scripting", "Azure", "Google Cloud"]',
 84000, 188000, 'medium', 'entry', 'Technology'),

('Cybersecurity Analyst', 'cybersecurity-analyst', 'Professional Cybersecurity Analyst specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 79000, 170000, 'very_high', 'senior', 'Technology'),

('Security Engineer', 'security-engineer', 'Professional Security Engineer specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 83000, 167000, 'medium', 'senior', 'Technology'),

('Penetration Tester', 'penetration-tester', 'Professional Penetration Tester specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 85000, 171000, 'very_high', 'mid', 'Technology'),

('Information Security Manager', 'information-security-manager', 'Professional Information Security Manager specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 84000, 166000, 'medium', 'mid', 'Technology'),

('Security Architect', 'security-architect', 'Professional Security Architect specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 78000, 170000, 'very_high', 'mid', 'Technology'),

('Ethical Hacker', 'ethical-hacker', 'Professional Ethical Hacker specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 77000, 163000, 'medium', 'mid', 'Technology'),

('Cloud Security Engineer', 'cloud-security-engineer', 'Professional Cloud Security Engineer specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 79000, 174000, 'high', 'mid', 'Technology'),

('Application Security Engineer', 'application-security-engineer', 'Professional Application Security Engineer specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 84000, 164000, 'high', 'mid', 'Technology'),

('Incident Responder', 'incident-responder', 'Professional Incident Responder specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 77000, 170000, 'high', 'senior', 'Technology'),

('Cryptography Engineer', 'cryptography-engineer', 'Professional Cryptography Engineer specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 81000, 169000, 'very_high', 'entry', 'Technology'),

('Forensics Investigator', 'forensics-investigator', 'Professional Forensics Investigator specializing in Security. Responsible for building and maintaining top-tier solutions.',
 '["Linux", "Communication", "Problem Solving"]',
 '["AWS", "Docker", "Python", "C++"]',
 83000, 162000, 'very_high', 'senior', 'Technology'),

('UI/UX Designer', 'ui-ux-designer', 'Professional UI/UX Designer specializing in Design & UX. Responsible for building and maintaining top-tier solutions.',
 '["Figma", "UI/UX Design", "Communication", "Problem Solving"]',
 '[]',
 58000, 157000, 'high', 'senior', 'Technology'),

('Product Designer', 'product-designer', 'Professional Product Designer specializing in Design & UX. Responsible for building and maintaining top-tier solutions.',
 '["Figma", "UI/UX Design", "Communication", "Problem Solving"]',
 '[]',
 56000, 158000, 'very_high', 'senior', 'Technology'),

('UX Researcher', 'ux-researcher', 'Professional UX Researcher specializing in Design & UX. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 53000, 149000, 'medium', 'entry', 'Technology'),

('UI Developer', 'ui-developer', 'Professional UI Developer specializing in Design & UX. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 60000, 157000, 'high', 'mid', 'Technology'),

('Graphic Designer', 'graphic-designer', 'Professional Graphic Designer specializing in Design & UX. Responsible for building and maintaining top-tier solutions.',
 '["Figma", "UI/UX Design", "Communication", "Problem Solving"]',
 '[]',
 60000, 160000, 'very_high', 'senior', 'Technology'),

('Interaction Designer', 'interaction-designer', 'Professional Interaction Designer specializing in Design & UX. Responsible for building and maintaining top-tier solutions.',
 '["Figma", "UI/UX Design", "Communication", "Problem Solving"]',
 '[]',
 53000, 147000, 'high', 'mid', 'Technology'),

('Visual Designer', 'visual-designer', 'Professional Visual Designer specializing in Design & UX. Responsible for building and maintaining top-tier solutions.',
 '["Figma", "UI/UX Design", "Communication", "Problem Solving"]',
 '[]',
 50000, 145000, 'very_high', 'senior', 'Technology'),

('Creative Director', 'creative-director', 'Professional Creative Director specializing in Design & UX. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 53000, 160000, 'high', 'senior', 'Technology'),

('Web Designer', 'web-designer', 'Professional Web Designer specializing in Design & UX. Responsible for building and maintaining top-tier solutions.',
 '["Figma", "UI/UX Design", "Communication", "Problem Solving"]',
 '[]',
 53000, 155000, 'medium', 'mid', 'Technology'),

('QA Engineer', 'qa-engineer', 'Professional QA Engineer specializing in Quality Assurance (QA). Responsible for building and maintaining top-tier solutions.',
 '["JIRA", "Agile", "Git", "Communication", "Problem Solving"]',
 '["Postman", "Selenium"]',
 51000, 153000, 'medium', 'senior', 'Technology'),

('Automation Tester', 'automation-tester', 'Professional Automation Tester specializing in Quality Assurance (QA). Responsible for building and maintaining top-tier solutions.',
 '["Python", "JIRA", "Agile", "CI/CD", "Communication", "Problem Solving", "JavaScript"]',
 '["Postman", "Selenium"]',
 57000, 152000, 'high', 'entry', 'Technology'),

('Manual Tester', 'manual-tester', 'Professional Manual Tester specializing in Quality Assurance (QA). Responsible for building and maintaining top-tier solutions.',
 '["JIRA", "Agile", "Communication", "Problem Solving"]',
 '["Postman", "Selenium"]',
 57000, 151000, 'high', 'entry', 'Technology'),

('SDET', 'sdet', 'Professional SDET specializing in Quality Assurance (QA). Responsible for building and maintaining top-tier solutions.',
 '["Python", "JIRA", "Agile", "CI/CD", "Communication", "Problem Solving", "JavaScript"]',
 '["Postman", "Selenium"]',
 54000, 143000, 'medium', 'senior', 'Technology'),

('Performance Test Engineer', 'performance-test-engineer', 'Professional Performance Test Engineer specializing in Quality Assurance (QA). Responsible for building and maintaining top-tier solutions.',
 '["JIRA", "Agile", "Git", "Communication", "Problem Solving"]',
 '["Postman", "Selenium"]',
 60000, 146000, 'high', 'entry', 'Technology'),

('Quality Assurance Manager', 'quality-assurance-manager', 'Professional Quality Assurance Manager specializing in Quality Assurance (QA). Responsible for building and maintaining top-tier solutions.',
 '["JIRA", "Agile", "Communication", "Problem Solving"]',
 '["Postman", "Selenium"]',
 51000, 153000, 'medium', 'mid', 'Technology'),

('Mobile QA Automation Engineer', 'mobile-qa-automation-engineer', 'Professional Mobile QA Automation Engineer specializing in Quality Assurance (QA). Responsible for building and maintaining top-tier solutions.',
 '["Python", "JIRA", "Agile", "Git", "CI/CD", "Communication", "Problem Solving", "JavaScript"]',
 '["Postman", "Selenium"]',
 55000, 145000, 'medium', 'senior', 'Technology'),

('Product Manager', 'product-manager', 'Professional Product Manager specializing in Product & Agile. Responsible for building and maintaining top-tier solutions.',
 '["Leadership", "JIRA", "Agile", "Communication", "Problem Solving", "Scrum"]',
 '[]',
 53000, 148000, 'medium', 'senior', 'Technology'),

('Scrum Master', 'scrum-master', 'Professional Scrum Master specializing in Product & Agile. Responsible for building and maintaining top-tier solutions.',
 '["Leadership", "JIRA", "Agile", "Communication", "Problem Solving", "Scrum"]',
 '[]',
 58000, 141000, 'very_high', 'mid', 'Technology'),

('Agile Coach', 'agile-coach', 'Professional Agile Coach specializing in Product & Agile. Responsible for building and maintaining top-tier solutions.',
 '["Leadership", "JIRA", "Agile", "Communication", "Problem Solving", "Scrum"]',
 '[]',
 52000, 159000, 'medium', 'entry', 'Technology'),

('Technical Product Manager', 'technical-product-manager', 'Professional Technical Product Manager specializing in Product & Agile. Responsible for building and maintaining top-tier solutions.',
 '["Leadership", "JIRA", "Agile", "Communication", "Problem Solving", "Scrum"]',
 '[]',
 59000, 151000, 'high', 'entry', 'Technology'),

('Product Owner', 'product-owner', 'Professional Product Owner specializing in Product & Agile. Responsible for building and maintaining top-tier solutions.',
 '["Leadership", "JIRA", "Agile", "Communication", "Problem Solving", "Scrum"]',
 '[]',
 50000, 143000, 'high', 'mid', 'Technology'),

('Business Analyst', 'business-analyst', 'Professional Business Analyst specializing in Product & Agile. Responsible for building and maintaining top-tier solutions.',
 '["Leadership", "JIRA", "Agile", "Communication", "Problem Solving", "Scrum"]',
 '[]',
 53000, 155000, 'medium', 'entry', 'Technology'),

('Technical Business Analyst', 'technical-business-analyst', 'Professional Technical Business Analyst specializing in Product & Agile. Responsible for building and maintaining top-tier solutions.',
 '["Leadership", "JIRA", "Agile", "Communication", "Problem Solving", "Scrum"]',
 '[]',
 53000, 140000, 'very_high', 'senior', 'Technology'),

('Project Manager', 'project-manager', 'Professional Project Manager specializing in Product & Agile. Responsible for building and maintaining top-tier solutions.',
 '["Leadership", "JIRA", "Agile", "Communication", "Problem Solving", "Scrum"]',
 '[]',
 55000, 152000, 'high', 'senior', 'Technology'),

('Salesforce Developer', 'salesforce-developer', 'Professional Salesforce Developer specializing in Enterprise & ERP. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 79000, 179000, 'medium', 'entry', 'Technology'),

('Salesforce Administrator', 'salesforce-administrator', 'Professional Salesforce Administrator specializing in Enterprise & ERP. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 81000, 180000, 'high', 'mid', 'Technology'),

('SAP Consultant', 'sap-consultant', 'Professional SAP Consultant specializing in Enterprise & ERP. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 75000, 179000, 'medium', 'entry', 'Technology'),

('Workday Consultant', 'workday-consultant', 'Professional Workday Consultant specializing in Enterprise & ERP. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 85000, 179000, 'medium', 'mid', 'Technology'),

('ServiceNow Developer', 'servicenow-developer', 'Professional ServiceNow Developer specializing in Enterprise & ERP. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 79000, 178000, 'very_high', 'entry', 'Technology'),

('ERP Analyst', 'erp-analyst', 'Professional ERP Analyst specializing in Enterprise & ERP. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 85000, 165000, 'high', 'mid', 'Technology'),

('SharePoint Developer', 'sharepoint-developer', 'Professional SharePoint Developer specializing in Enterprise & ERP. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 80000, 164000, 'high', 'senior', 'Technology'),

('Game Developer', 'game-developer', 'Professional Game Developer specializing in Game & AR/VR. Responsible for building and maintaining top-tier solutions.',
 '["Unity", "C#", "Git", "Problem Solving", "C++"]',
 '[]',
 54000, 151000, 'very_high', 'entry', 'Technology'),

('Unity Developer', 'unity-developer', 'Professional Unity Developer specializing in Game & AR/VR. Responsible for building and maintaining top-tier solutions.',
 '["Unity", "C#", "Git", "Problem Solving", "C++"]',
 '[]',
 58000, 158000, 'high', 'senior', 'Technology'),

('Unreal Engine Developer', 'unreal-engine-developer', 'Professional Unreal Engine Developer specializing in Game & AR/VR. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 51000, 151000, 'medium', 'mid', 'Technology'),

('AR/VR Developer', 'ar-vr-developer', 'Professional AR/VR Developer specializing in Game & AR/VR. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 60000, 145000, 'high', 'mid', 'Technology'),

('Technical Artist', 'technical-artist', 'Professional Technical Artist specializing in Game & AR/VR. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 60000, 149000, 'medium', 'entry', 'Technology'),

('Game Designer', 'game-designer', 'Professional Game Designer specializing in Game & AR/VR. Responsible for building and maintaining top-tier solutions.',
 '["Unity", "UI/UX Design", "C#", "Figma", "Communication", "Problem Solving", "C++"]',
 '[]',
 54000, 145000, 'medium', 'senior', 'Technology'),

('3D Generalist', '3d-generalist', 'Professional 3D Generalist specializing in Game & AR/VR. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 52000, 153000, 'high', 'senior', 'Technology'),

('Blockchain Developer', 'blockchain-developer', 'Professional Blockchain Developer specializing in Emerging Tech. Responsible for building and maintaining top-tier solutions.',
 '["Solidity", "Git", "Web3.js", "Problem Solving", "JavaScript"]',
 '[]',
 86000, 196000, 'high', 'entry', 'Technology'),

('Smart Contract Developer', 'smart-contract-developer', 'Professional Smart Contract Developer specializing in Emerging Tech. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 83000, 184000, 'very_high', 'entry', 'Technology'),

('Web3 Engineer', 'web3-engineer', 'Professional Web3 Engineer specializing in Emerging Tech. Responsible for building and maintaining top-tier solutions.',
 '["Solidity", "Git", "Web3.js", "Problem Solving", "JavaScript"]',
 '[]',
 84000, 184000, 'very_high', 'mid', 'Technology'),

('IoT Engineer', 'iot-engineer', 'Professional IoT Engineer specializing in Emerging Tech. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 82000, 188000, 'high', 'mid', 'Technology'),

('Robotics Engineer', 'robotics-engineer', 'Professional Robotics Engineer specializing in Emerging Tech. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 80000, 197000, 'high', 'entry', 'Technology'),

('Embedded Systems Engineer', 'embedded-systems-engineer', 'Professional Embedded Systems Engineer specializing in Emerging Tech. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 87000, 191000, 'high', 'entry', 'Technology'),

('Database Administrator', 'database-administrator', 'Professional Database Administrator specializing in System & Database. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 54000, 150000, 'high', 'senior', 'Technology'),

('System Administrator', 'system-administrator', 'Professional System Administrator specializing in System & Database. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 52000, 149000, 'medium', 'mid', 'Technology'),

('Linux Administrator', 'linux-administrator', 'Professional Linux Administrator specializing in System & Database. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 53000, 145000, 'medium', 'entry', 'Technology'),

('Windows Server Administrator', 'windows-server-administrator', 'Professional Windows Server Administrator specializing in System & Database. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 57000, 145000, 'medium', 'entry', 'Technology'),

('Storage Engineer', 'storage-engineer', 'Professional Storage Engineer specializing in System & Database. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 53000, 143000, 'high', 'senior', 'Technology'),

('SQL Developer', 'sql-developer', 'Professional SQL Developer specializing in System & Database. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 59000, 146000, 'very_high', 'mid', 'Technology'),

('Developer Advocate', 'developer-advocate', 'Professional Developer Advocate specializing in Developer Relations. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 53000, 160000, 'medium', 'senior', 'Technology'),

('Developer Relations Engineer', 'developer-relations-engineer', 'Professional Developer Relations Engineer specializing in Developer Relations. Responsible for building and maintaining top-tier solutions.',
 '["Git", "Problem Solving"]',
 '[]',
 55000, 144000, 'medium', 'senior', 'Technology'),

('Technical Writer', 'technical-writer', 'Professional Technical Writer specializing in Developer Relations. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 52000, 156000, 'medium', 'mid', 'Technology'),

('Documentation Manager', 'documentation-manager', 'Professional Documentation Manager specializing in Developer Relations. Responsible for building and maintaining top-tier solutions.',
 '["Problem Solving"]',
 '[]',
 52000, 141000, 'medium', 'entry', 'Technology')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- =============================================
-- SEED ADMIN USER (password: Admin@123456)
-- =============================================
INSERT INTO users (email, password_hash, first_name, last_name, role, career_score) VALUES
('admin@meriparo.com', '$2a$10$XvDYSUZVum2tt5L00URs8eeUFJPRfo3/VYVvFXzVcrEeLsfxyykAi', 'Admin', 'User', 'admin', 95.00)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin';

-- SEED TEST USER (password: User@123456)
INSERT INTO users (email, password_hash, first_name, last_name, role, career_score) VALUES
('user@meriparo.com', '$2a$10$mAMl58k4EPdKj6GWOa9f9u0AegK/N/900BVIXRCN7j5ma3.WYvY3.', 'Test', 'User', 'user', 45.00)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'user';
