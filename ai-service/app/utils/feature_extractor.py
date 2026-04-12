import re
from typing import List, Dict
import json
import os


class FeatureExtractor:
    """Extracts structured features from resume text."""

    def __init__(self):
        self._skills_taxonomy = None
        self._load_taxonomy()

    def _load_taxonomy(self):
        taxonomy_path = os.path.join(
            os.path.dirname(__file__), "..", "data", "skills_taxonomy.json"
        )
        try:
            with open(taxonomy_path, "r") as f:
                self._skills_taxonomy = json.load(f)
        except FileNotFoundError:
            self._skills_taxonomy = self._default_taxonomy()

    def _default_taxonomy(self) -> dict:
        return {
            "programming": [
                "python", "javascript", "typescript", "java", "c++", "c#",
                "go", "rust", "php", "ruby", "swift", "kotlin", "r",
                "scala", "sql", "html", "css", "bash", "shell",
            ],
            "frameworks": [
                "react", "angular", "vue", "vue.js", "node.js", "nodejs",
                "express", "express.js", "django", "flask", "fastapi",
                "spring", "spring boot", "next.js", "nextjs", ".net",
                "dotnet", "laravel", "rails", "ruby on rails",
                "tailwindcss", "tailwind", "bootstrap", "jquery",
                "tensorflow", "pytorch", "scikit-learn", "sklearn",
                "keras", "react native", "flutter", "electron",
            ],
            "databases": [
                "mysql", "postgresql", "postgres", "mongodb", "redis",
                "elasticsearch", "dynamodb", "firebase", "sqlite",
                "oracle", "cassandra", "neo4j", "mariadb",
            ],
            "cloud": [
                "aws", "amazon web services", "azure", "microsoft azure",
                "gcp", "google cloud", "heroku", "vercel", "netlify",
                "digitalocean",
            ],
            "devops": [
                "docker", "kubernetes", "k8s", "jenkins", "github actions",
                "gitlab ci", "terraform", "ansible", "ci/cd", "cicd",
                "linux", "nginx", "apache", "grafana", "prometheus",
            ],
            "tools": [
                "git", "github", "gitlab", "bitbucket", "jira",
                "confluence", "postman", "swagger", "webpack", "vite",
                "npm", "yarn", "pip", "maven", "gradle",
            ],
            "ai_ml": [
                "machine learning", "deep learning", "nlp",
                "natural language processing", "computer vision",
                "neural network", "reinforcement learning",
                "data science", "data analysis", "data engineering",
                "mlops", "feature engineering", "model training",
            ],
            "design": [
                "figma", "adobe xd", "sketch", "photoshop",
                "illustrator", "ui/ux", "ui design", "ux design",
                "wireframing", "prototyping",
            ],
            "soft_skills": [
                "leadership", "communication", "teamwork",
                "problem solving", "critical thinking",
                "project management", "agile", "scrum", "kanban",
            ],
            "data_tools": [
                "tableau", "power bi", "excel", "pandas", "numpy",
                "matplotlib", "seaborn", "plotly", "spark",
                "apache spark", "hadoop", "airflow",
            ],
            "other": [
                "rest api", "restful", "graphql", "microservices",
                "websocket", "oauth", "jwt", "api design",
                "system design", "design patterns",
            ],
        }

    def extract_skills(self, text: str) -> List[str]:
        if not text:
            return []

        text_lower = text.lower()
        found_skills = set()

        for category, skills in self._skills_taxonomy.items():
            for skill in skills:
                pattern = r"\b" + re.escape(skill.lower()) + r"\b"
                if re.search(pattern, text_lower):
                    found_skills.add(self._normalize_skill(skill))

        return sorted(list(found_skills))

    def _normalize_skill(self, skill: str) -> str:
        normalization_map = {
            "nodejs": "Node.js", "node.js": "Node.js",
            "express.js": "Express.js", "express": "Express.js",
            "vue.js": "Vue.js", "vue": "Vue.js",
            "next.js": "Next.js", "nextjs": "Next.js",
            "react native": "React Native", "react": "React",
            "angular": "Angular", "python": "Python",
            "javascript": "JavaScript", "typescript": "TypeScript",
            "java": "Java", "c++": "C++", "c#": "C#",
            "go": "Go", "rust": "Rust", "php": "PHP",
            "ruby": "Ruby", "swift": "Swift", "kotlin": "Kotlin",
            "sql": "SQL", "html": "HTML", "css": "CSS",
            "r": "R", "scala": "Scala", "bash": "Bash", "shell": "Shell",
            "django": "Django", "flask": "Flask", "fastapi": "FastAPI",
            "spring boot": "Spring Boot", "spring": "Spring Boot",
            ".net": ".NET", "dotnet": ".NET",
            "laravel": "Laravel", "rails": "Ruby on Rails",
            "ruby on rails": "Ruby on Rails",
            "tailwindcss": "TailwindCSS", "tailwind": "TailwindCSS",
            "bootstrap": "Bootstrap", "jquery": "jQuery",
            "tensorflow": "TensorFlow", "pytorch": "PyTorch",
            "scikit-learn": "Scikit-learn", "sklearn": "Scikit-learn",
            "keras": "Keras",
            "mysql": "MySQL", "postgresql": "PostgreSQL",
            "postgres": "PostgreSQL", "mongodb": "MongoDB",
            "redis": "Redis", "elasticsearch": "Elasticsearch",
            "dynamodb": "DynamoDB", "firebase": "Firebase",
            "sqlite": "SQLite", "oracle": "Oracle", "cassandra": "Cassandra",
            "aws": "AWS", "amazon web services": "AWS",
            "azure": "Azure", "microsoft azure": "Azure",
            "gcp": "Google Cloud", "google cloud": "Google Cloud",
            "heroku": "Heroku", "vercel": "Vercel", "netlify": "Netlify",
            "docker": "Docker", "kubernetes": "Kubernetes", "k8s": "Kubernetes",
            "jenkins": "Jenkins", "github actions": "GitHub Actions",
            "gitlab ci": "GitLab CI", "terraform": "Terraform",
            "ansible": "Ansible", "ci/cd": "CI/CD", "cicd": "CI/CD",
            "linux": "Linux", "nginx": "Nginx",
            "git": "Git", "github": "GitHub", "gitlab": "GitLab",
            "jira": "JIRA", "postman": "Postman", "webpack": "Webpack",
            "machine learning": "Machine Learning",
            "deep learning": "Deep Learning",
            "nlp": "NLP", "natural language processing": "NLP",
            "computer vision": "Computer Vision",
            "data science": "Data Science", "data analysis": "Data Analysis",
            "figma": "Figma", "adobe xd": "Adobe XD", "sketch": "Sketch",
            "agile": "Agile", "scrum": "Scrum",
            "tableau": "Tableau", "power bi": "Power BI", "excel": "Excel",
            "pandas": "Pandas", "numpy": "NumPy",
            "spark": "Apache Spark", "apache spark": "Apache Spark",
            "graphql": "GraphQL", "rest api": "REST API",
            "restful": "REST API", "microservices": "Microservices",
        }

        return normalization_map.get(skill.lower(), skill.title())

    def extract_education(self, text: str) -> List[Dict]:
        education = []
        degree_patterns = [
            r"(?:bachelor|b\.?s\.?|b\.?tech|b\.?e\.?|b\.?a\.?)[\s\.\,]*(?:of|in)?\s*[\w\s]+",
            r"(?:master|m\.?s\.?|m\.?tech|m\.?e\.?|m\.?a\.?|mba)[\s\.\,]*(?:of|in)?\s*[\w\s]+",
            r"(?:ph\.?d\.?|doctorate|doctoral)[\s\.\,]*(?:of|in)?\s*[\w\s]+",
            r"(?:diploma|certificate|associate)[\s\.\,]*(?:of|in)?\s*[\w\s]+",
        ]

        for pattern in degree_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                degree_text = match.group().strip()
                if len(degree_text) > 5:
                    education.append({
                        "degree": degree_text[:200],
                        "raw": degree_text[:300],
                    })

        year_pattern = r"(20\d{2}|19\d{2})"
        years = re.findall(year_pattern, text)
        if years and education:
            for i, edu in enumerate(education):
                if i < len(years):
                    edu["year"] = years[i]

        return education[:5]

    def extract_experience(self, text: str) -> List[Dict]:
        experience = []

        exp_patterns = [
            r"(?:worked\s+(?:at|with|for)|employed\s+(?:at|by))\s+([\w\s\.\,]+?)(?:\s+(?:as|from|since|\d))",
            r"([\w\s]+?)\s*[\-\u2013|]\s*([\w\s]+?)\s*[\-\u2013|]\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{4})",
        ]

        for pattern in exp_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                groups = match.groups()
                if groups:
                    experience.append({
                        "raw": match.group().strip()[:300],
                        "company": groups[0].strip()[:200] if len(groups) > 0 else "",
                        "role": groups[1].strip()[:200] if len(groups) > 1 else "",
                    })

        year_pattern = r"(\d+)\s*(?:\+)?\s*(?:years?|yrs?)"
        year_match = re.search(year_pattern, text, re.IGNORECASE)
        total_years = int(year_match.group(1)) if year_match else 0

        if not experience and total_years > 0:
            experience.append({
                "raw": f"{total_years} years of experience mentioned",
                "total_years": total_years,
            })

        return experience[:10]

    def extract_contact(self, text: str) -> Dict:
        contact = {}

        email_match = re.search(r"[\w\.\-]+@[\w\.\-]+\.\w+", text)
        if email_match:
            contact["email"] = email_match.group()

        phone_match = re.search(
            r"(?:\+?\d{1,3}[\s\-]?)?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}", text
        )
        if phone_match:
            contact["phone"] = phone_match.group()

        linkedin_match = re.search(
            r"(?:linkedin\.com/in/)([\w\-]+)", text, re.IGNORECASE
        )
        if linkedin_match:
            contact["linkedin"] = f"linkedin.com/in/{linkedin_match.group(1)}"

        github_match = re.search(
            r"(?:github\.com/)([\w\-]+)", text, re.IGNORECASE
        )
        if github_match:
            contact["github"] = f"github.com/{github_match.group(1)}"

        lines = text.strip().split("\n")
        if lines:
            first_line = lines[0].strip()
            if (
                len(first_line) < 50
                and not re.search(r"\d", first_line)
                and "@" not in first_line
            ):
                contact["name"] = first_line

        return contact

    def calculate_ats_score(self, text: str, skills: List[str]) -> float:
        score = 0.0

        # Skill density (30 points)
        skill_count = len(skills)
        score += min(skill_count * 3, 30)

        # Text length adequacy (15 points)
        word_count = len(text.split())
        if word_count >= 300:
            score += 15
        elif word_count >= 150:
            score += 10
        elif word_count >= 50:
            score += 5

        # Section presence (20 points)
        text_lower = text.lower()
        for section in ["experience", "education", "skills", "project"]:
            if section in text_lower:
                score += 5

        # Contact info (15 points)
        contact = self.extract_contact(text)
        score += len(contact) * 3.75

        # Action verbs (10 points)
        action_verbs = [
            "developed", "managed", "led", "created", "designed",
            "implemented", "built", "optimized", "deployed", "analyzed",
            "maintained", "improved", "launched", "automated", "architected",
        ]
        verb_count = sum(1 for verb in action_verbs if verb in text_lower)
        score += min(verb_count * 2, 10)

        # Quantifiable achievements (10 points)
        numbers = re.findall(r"\d+%|\d+\s*(?:users|clients|projects|team)", text_lower)
        score += min(len(numbers) * 2.5, 10)

        return min(round(score, 2), 100.0)
