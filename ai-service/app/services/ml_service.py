import logging
import os
import numpy as np
from typing import List, Dict

logger = logging.getLogger(__name__)


class MLService:
    """ML pipeline: TF-IDF + Logistic Regression + Random Forest."""

    def __init__(self):
        self._lr_model = None
        self._rf_model = None
        self._vectorizer = None
        self._label_encoder = None
        self._classes = []
        self._initialized = False

    def initialize(self):
        """Initialize and train ML models."""
        try:
            model_path = os.getenv("MODEL_PATH", "trained_models")
            lr_path = os.path.join(model_path, "lr_model.pkl")

            if os.path.exists(lr_path):
                self._load_models(model_path)
            else:
                self._train_models(model_path)

            self._initialized = True
            logger.info("ML models initialized successfully")
        except Exception as e:
            logger.error(f"ML model initialization failed: {e}")
            self._initialized = False

    def _train_models(self, model_path: str):
        """Train Logistic Regression and Random Forest models."""
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.linear_model import LogisticRegression
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.preprocessing import LabelEncoder
        import joblib

        training_data = self._get_training_data()
        texts = [item["text"] for item in training_data]
        labels = [item["label"] for item in training_data]

        self._vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2), sublinear_tf=True)
        X = self._vectorizer.fit_transform(texts)

        self._label_encoder = LabelEncoder()
        y = self._label_encoder.fit_transform(labels)
        self._classes = list(self._label_encoder.classes_)

        # Logistic Regression
        self._lr_model = LogisticRegression(
            max_iter=1000,
            solver='lbfgs', C=1.0, random_state=42
        )
        self._lr_model.fit(X, y)

        # Random Forest
        self._rf_model = RandomForestClassifier(
            n_estimators=100, max_depth=20,
            random_state=42, n_jobs=-1
        )
        self._rf_model.fit(X, y)

        # Save models
        os.makedirs(model_path, exist_ok=True)
        joblib.dump(self._lr_model, os.path.join(model_path, "lr_model.pkl"))
        joblib.dump(self._rf_model, os.path.join(model_path, "rf_model.pkl"))
        joblib.dump(self._vectorizer, os.path.join(model_path, "ml_vectorizer.pkl"))
        joblib.dump(self._label_encoder, os.path.join(model_path, "ml_label_encoder.pkl"))

        logger.info(f"ML models trained: {len(training_data)} samples, {len(self._classes)} classes")

    def _load_models(self, model_path: str):
        """Load pre-trained models."""
        import joblib

        self._lr_model = joblib.load(os.path.join(model_path, "lr_model.pkl"))
        self._rf_model = joblib.load(os.path.join(model_path, "rf_model.pkl"))
        self._vectorizer = joblib.load(os.path.join(model_path, "ml_vectorizer.pkl"))
        self._label_encoder = joblib.load(os.path.join(model_path, "ml_label_encoder.pkl"))
        self._classes = list(self._label_encoder.classes_)
        logger.info("ML models loaded from disk")

    def predict(self, skills: List[str], raw_text: str = "", model: str = "ensemble") -> List[Dict]:
        """Predict job roles using ML models."""
        if not self._initialized:
            logger.warning("ML models not initialized")
            return []

        text = " ".join(skills) + " " + raw_text
        X = self._vectorizer.transform([text])

        lr_probs = self._lr_model.predict_proba(X)[0]
        rf_probs = self._rf_model.predict_proba(X)[0]

        # Ensemble: weighted average (LR: 40%, RF: 60%)
        if model == "logistic_regression":
            ensemble_probs = lr_probs
        elif model == "random_forest":
            ensemble_probs = rf_probs
        else:
            ensemble_probs = 0.4 * lr_probs + 0.6 * rf_probs

        results = []
        for i, prob in enumerate(ensemble_probs):
            if i < len(self._classes):
                results.append({
                    "role": self._classes[i],
                    "confidence": round(float(prob), 4),
                    "model": "ml_ensemble",
                    "lr_confidence": round(float(lr_probs[i]), 4),
                    "rf_confidence": round(float(rf_probs[i]), 4),
                })

        results.sort(key=lambda x: x["confidence"], reverse=True)
        return results[:5]

    def _get_training_data(self) -> List[Dict]:
        """Load training data from shared JSON file."""
        import json

        data_path = os.path.join(
            os.path.dirname(__file__), "..", "data", "training_data.json"
        )
        try:
            with open(data_path, "r") as f:
                role_skill_sets = json.load(f)
        except FileNotFoundError:
            logger.warning("training_data.json not found, using minimal fallback")
            role_skill_sets = {
                "Full Stack Developer": ["git css html problem solving"],
                "Frontend Developer": ["git css html problem solving"],
                "Backend Developer": ["node.js css html git rest api problem solving sql"],
                "React Developer": ["react css html git problem solving javascript"],
                "Angular Developer": ["css html typescript git angular problem solving javascript"],
                "Vue.js Developer": ["css html git vue.js problem solving javascript"],
                "Node.js Developer": ["node.js css html git rest api problem solving sql"],
                "PHP Developer": ["css html php mysql git problem solving"],
                "Ruby on Rails Developer": ["git css html problem solving"],
                "Python Web Developer": ["python css html git django problem solving sql"],
                "Django Developer": ["python css html git django problem solving sql"],
                "Go Developer": ["git css html problem solving"],
                "Mobile Developer": ["kotlin git rest api problem solving swift javascript"],
                "iOS Developer": ["git rest api swift problem solving"],
                "Android Developer": ["kotlin git rest api problem solving"],
                "Flutter Developer": ["git rest api javascript problem solving"],
                "React Native Developer": ["react git rest api problem solving javascript"],
                "Swift Developer": ["git rest api swift problem solving"],
                "Kotlin Developer": ["kotlin git rest api problem solving"],
                "Mobile Architect": ["kotlin rest api problem solving swift javascript"],
                "Data Scientist": ["machine learning python problem solving data analysis sql scikit-learn"],
                "Data Analyst": ["data analysis python sql problem solving"],
                "Data Engineer": ["python git problem solving data analysis sql"],
                "Business Intelligence Analyst": ["data analysis python sql problem solving"],
                "Machine Learning Engineer": ["machine learning python git problem solving data analysis sql scikit-learn"],
                "Deep Learning Engineer": ["python git problem solving data analysis sql"],
                "NLP Engineer": ["python git problem solving data analysis sql"],
                "Computer Vision Engineer": ["python git problem solving data analysis sql"],
                "AI Engineer": ["machine learning python git problem solving data analysis sql scikit-learn"],
                "Big Data Engineer": ["python git problem solving data analysis sql"],
                "Data Analytics Manager": ["data analysis python sql problem solving"],
                "Data Architect": ["data analysis python sql problem solving"],
                "Quantitative Analyst": ["data analysis python sql problem solving"],
                "Marketing Data Analyst": ["data analysis python sql problem solving"],
                "Predictive Modeler": ["data analysis python sql problem solving"],
                "DevOps Engineer": ["aws jenkins git docker linux problem solving ci/cd"],
                "Cloud Architect": ["aws docker linux problem solving kubernetes terraform"],
                "Cloud Engineer": ["aws git docker linux problem solving"],
                "Site Reliability Engineer": ["aws git docker linux problem solving"],
                "AWS Solutions Architect": ["aws docker linux problem solving kubernetes terraform"],
                "Azure Cloud Engineer": ["aws git docker linux problem solving"],
                "GCP Engineer": ["aws git docker linux problem solving"],
                "Infrastructure Engineer": ["aws git docker linux problem solving"],
                "Platform Engineer": ["aws git docker linux problem solving"],
                "Kubernetes Administrator": ["aws docker linux problem solving kubernetes terraform"],
                "Build Engineer": ["aws git docker linux problem solving"],
                "Release Manager": ["aws docker linux problem solving"],
                "Network Engineer": ["aws git docker linux problem solving"],
                "Cybersecurity Analyst": ["linux communication problem solving"],
                "Security Engineer": ["git linux communication problem solving"],
                "Penetration Tester": ["linux communication problem solving"],
                "Information Security Manager": ["linux communication problem solving"],
                "Security Architect": ["linux communication problem solving"],
                "Ethical Hacker": ["linux communication problem solving"],
                "Cloud Security Engineer": ["git linux communication problem solving"],
                "Application Security Engineer": ["git linux communication problem solving"],
                "Incident Responder": ["linux communication problem solving"],
                "Cryptography Engineer": ["git linux communication problem solving"],
                "Forensics Investigator": ["linux communication problem solving"],
                "UI/UX Designer": ["figma ui/ux design communication problem solving"],
            }

        data = []
        for role, skill_sets in role_skill_sets.items():
            for skills_text in skill_sets:
                data.append({"text": skills_text, "label": role})

        logger.info(f"Loaded {len(data)} training samples across {len(role_skill_sets)} classes")
        return data
