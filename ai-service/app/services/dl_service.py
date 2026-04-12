import logging
from typing import List, Dict
from app.models.deep_learning_model import DeepLearningModel
from app.models.embeddings import EmbeddingModel
import os

logger = logging.getLogger(__name__)


class DLService:
    """Deep Learning service orchestrating NN classification and semantic matching."""

    def __init__(self):
        self.dl_model = DeepLearningModel()
        self.embedding_model = EmbeddingModel()
        self._initialized = False

    def initialize(self):
        """Initialize deep learning models."""
        model_path = os.getenv("MODEL_PATH", "trained_models")

        # Initialize feedforward neural network
        self.dl_model.initialize(model_path)

        # Initialize sentence transformer (optional - may fail on low-resource systems)
        try:
            self.embedding_model.initialize()
        except Exception as e:
            logger.warning(f"Embedding model not available: {e}")

        self._initialized = True
        logger.info("DL Service initialized")

    def predict(self, skills: List[str], raw_text: str = "") -> Dict:
        """Predict job roles using deep learning."""
        results = {
            "predictions": [],
            "model_used": "deep_learning",
            "embedding_available": self.embedding_model.is_available,
        }

        # Neural network predictions
        nn_predictions = self.dl_model.predict(skills, raw_text)
        if nn_predictions:
            results["predictions"] = nn_predictions

        # If embedding model is available, enhance with semantic similarity
        if self.embedding_model.is_available and skills:
            resume_text = " ".join(skills) + " " + raw_text
            role_descriptions = {
                "Full Stack Developer": "full stack developer git css html problem solving",
                "Frontend Developer": "frontend developer git css html problem solving",
                "Backend Developer": "backend developer node.js css html git rest api problem solving sql",
                "React Developer": "react developer react css html git problem solving javascript",
                "Angular Developer": "angular developer css html typescript git angular problem solving javascript",
                "Vue.js Developer": "vue.js developer css html git vue.js problem solving javascript",
                "Node.js Developer": "node.js developer node.js css html git rest api problem solving sql",
                "PHP Developer": "php developer css html php mysql git problem solving",
                "Ruby on Rails Developer": "ruby on rails developer git css html problem solving",
                "Python Web Developer": "python web developer python css html git django problem solving sql",
                "Django Developer": "django developer python css html git django problem solving sql",
                "Go Developer": "go developer git css html problem solving",
                "Mobile Developer": "mobile developer kotlin git rest api problem solving swift javascript",
                "iOS Developer": "ios developer git rest api swift problem solving",
                "Android Developer": "android developer kotlin git rest api problem solving",
                "Flutter Developer": "flutter developer git rest api javascript problem solving",
                "React Native Developer": "react native developer react git rest api problem solving javascript",
                "Swift Developer": "swift developer git rest api swift problem solving",
                "Kotlin Developer": "kotlin developer kotlin git rest api problem solving",
                "Mobile Architect": "mobile architect kotlin rest api problem solving swift javascript",
                "Data Scientist": "data scientist machine learning python problem solving data analysis sql scikit-learn",
                "Data Analyst": "data analyst data analysis python sql problem solving",
                "Data Engineer": "data engineer python git problem solving data analysis sql",
                "Business Intelligence Analyst": "business intelligence analyst data analysis python sql problem solving",
                "Machine Learning Engineer": "machine learning engineer machine learning python git problem solving data analysis sql scikit-learn",
                "Deep Learning Engineer": "deep learning engineer python git problem solving data analysis sql",
                "NLP Engineer": "nlp engineer python git problem solving data analysis sql",
                "Computer Vision Engineer": "computer vision engineer python git problem solving data analysis sql",
                "AI Engineer": "ai engineer machine learning python git problem solving data analysis sql scikit-learn",
                "Big Data Engineer": "big data engineer python git problem solving data analysis sql",
                "Data Analytics Manager": "data analytics manager data analysis python sql problem solving",
                "Data Architect": "data architect data analysis python sql problem solving",
                "Quantitative Analyst": "quantitative analyst data analysis python sql problem solving",
                "Marketing Data Analyst": "marketing data analyst data analysis python sql problem solving",
                "Predictive Modeler": "predictive modeler data analysis python sql problem solving",
                "DevOps Engineer": "devops engineer aws jenkins git docker linux problem solving ci/cd",
                "Cloud Architect": "cloud architect aws docker linux problem solving kubernetes terraform",
                "Cloud Engineer": "cloud engineer aws git docker linux problem solving",
                "Site Reliability Engineer": "site reliability engineer aws git docker linux problem solving",
                "AWS Solutions Architect": "aws solutions architect aws docker linux problem solving kubernetes terraform",
                "Azure Cloud Engineer": "azure cloud engineer aws git docker linux problem solving",
                "GCP Engineer": "gcp engineer aws git docker linux problem solving",
                "Infrastructure Engineer": "infrastructure engineer aws git docker linux problem solving",
                "Platform Engineer": "platform engineer aws git docker linux problem solving",
                "Kubernetes Administrator": "kubernetes administrator aws docker linux problem solving kubernetes terraform",
                "Build Engineer": "build engineer aws git docker linux problem solving",
                "Release Manager": "release manager aws docker linux problem solving",
                "Network Engineer": "network engineer aws git docker linux problem solving",
                "Cybersecurity Analyst": "cybersecurity analyst linux communication problem solving",
                "Security Engineer": "security engineer git linux communication problem solving",
                "Penetration Tester": "penetration tester linux communication problem solving",
                "Information Security Manager": "information security manager linux communication problem solving",
                "Security Architect": "security architect linux communication problem solving",
                "Ethical Hacker": "ethical hacker linux communication problem solving",
                "Cloud Security Engineer": "cloud security engineer git linux communication problem solving",
                "Application Security Engineer": "application security engineer git linux communication problem solving",
                "Incident Responder": "incident responder linux communication problem solving",
                "Cryptography Engineer": "cryptography engineer git linux communication problem solving",
                "Forensics Investigator": "forensics investigator linux communication problem solving",
                "UI/UX Designer": "ui/ux designer figma ui/ux design communication problem solving",
                "Product Designer": "product designer figma ui/ux design communication problem solving",
                "UX Researcher": "ux researcher problem solving",
                "UI Developer": "ui developer git problem solving",
                "Graphic Designer": "graphic designer figma ui/ux design communication problem solving",
                "Interaction Designer": "interaction designer figma ui/ux design communication problem solving",
                "Visual Designer": "visual designer figma ui/ux design communication problem solving",
                "Creative Director": "creative director problem solving",
                "Web Designer": "web designer figma ui/ux design communication problem solving",
                "QA Engineer": "qa engineer jira agile git communication problem solving",
                "Automation Tester": "automation tester python jira agile ci/cd communication problem solving javascript",
                "Manual Tester": "manual tester jira agile communication problem solving",
                "SDET": "sdet python jira agile ci/cd communication problem solving javascript",
                "Performance Test Engineer": "performance test engineer jira agile git communication problem solving",
                "Quality Assurance Manager": "quality assurance manager jira agile communication problem solving",
                "Mobile QA Automation Engineer": "mobile qa automation engineer python jira agile git ci/cd communication problem solving javascript",
                "Product Manager": "product manager leadership jira agile communication problem solving scrum",
                "Scrum Master": "scrum master leadership jira agile communication problem solving scrum",
                "Agile Coach": "agile coach leadership jira agile communication problem solving scrum",
                "Technical Product Manager": "technical product manager leadership jira agile communication problem solving scrum",
                "Product Owner": "product owner leadership jira agile communication problem solving scrum",
                "Business Analyst": "business analyst leadership jira agile communication problem solving scrum",
                "Technical Business Analyst": "technical business analyst leadership jira agile communication problem solving scrum",
                "Project Manager": "project manager leadership jira agile communication problem solving scrum",
                "Salesforce Developer": "salesforce developer git problem solving",
                "Salesforce Administrator": "salesforce administrator problem solving",
                "SAP Consultant": "sap consultant problem solving",
                "Workday Consultant": "workday consultant problem solving",
                "ServiceNow Developer": "servicenow developer git problem solving",
                "ERP Analyst": "erp analyst problem solving",
                "SharePoint Developer": "sharepoint developer git problem solving",
                "Game Developer": "game developer unity c# git problem solving c++",
                "Unity Developer": "unity developer unity c# git problem solving c++",
                "Unreal Engine Developer": "unreal engine developer git problem solving",
                "AR/VR Developer": "ar/vr developer git problem solving",
                "Technical Artist": "technical artist problem solving",
                "Game Designer": "game designer unity ui/ux design c# figma communication problem solving c++",
                "3D Generalist": "3d generalist problem solving",
                "Blockchain Developer": "blockchain developer solidity git web3.js problem solving javascript",
                "Smart Contract Developer": "smart contract developer git problem solving",
                "Web3 Engineer": "web3 engineer solidity git web3.js problem solving javascript",
                "IoT Engineer": "iot engineer git problem solving",
                "Robotics Engineer": "robotics engineer git problem solving",
                "Embedded Systems Engineer": "embedded systems engineer git problem solving",
                "Database Administrator": "database administrator problem solving",
                "System Administrator": "system administrator problem solving",
                "Linux Administrator": "linux administrator problem solving",
                "Windows Server Administrator": "windows server administrator problem solving",
                "Storage Engineer": "storage engineer git problem solving",
                "SQL Developer": "sql developer git problem solving",
                "Developer Advocate": "developer advocate git problem solving",
                "Developer Relations Engineer": "developer relations engineer git problem solving",
                "Technical Writer": "technical writer problem solving",
                "Documentation Manager": "documentation manager problem solving",
            }

            candidates = list(role_descriptions.values())
            role_names = list(role_descriptions.keys())

            similarities = self.embedding_model.batch_similarity(resume_text, candidates)

            semantic_results = []
            for i, (role, sim) in enumerate(zip(role_names, similarities)):
                semantic_results.append({
                    "role": role,
                    "semantic_similarity": round(sim, 4),
                })

            semantic_results.sort(key=lambda x: x["semantic_similarity"], reverse=True)
            results["semantic_matches"] = semantic_results[:5]

            # Combine NN and semantic scores if both available
            if nn_predictions:
                combined = []
                for nn_pred in nn_predictions:
                    sem_match = next(
                        (s for s in semantic_results if s["role"] == nn_pred["role"]),
                        None
                    )
                    sem_score = sem_match["semantic_similarity"] if sem_match else 0
                    combined_score = 0.6 * nn_pred["confidence"] + 0.4 * sem_score
                    combined.append({
                        **nn_pred,
                        "semantic_score": sem_score,
                        "combined_score": round(combined_score, 4),
                        "model": "deep_learning_hybrid",
                    })
                combined.sort(key=lambda x: x["combined_score"], reverse=True)
                results["predictions"] = combined[:5]

        results["total_skills_analyzed"] = len(skills)
        return results
