import logging
import numpy as np
import os
from typing import List, Dict

logger = logging.getLogger(__name__)


class DeepLearningModel:
    """
    Deep Learning model for job role classification.
    Custom feedforward neural network (input -> 256 -> 128 -> 64 -> output)
    trained with backpropagation from scratch using NumPy.
    """

    def __init__(self):
        self._model = None
        self._vectorizer = None
        self._label_encoder = None
        self._classes = []
        self._initialized = False

    def initialize(self, model_path: str = "trained_models"):
        """Initialize the DL model - train if no saved model exists."""
        try:
            saved_model_path = os.path.join(model_path, "dl_model.npz")
            if os.path.exists(saved_model_path):
                self._load_model(saved_model_path)
            else:
                self._train_model(model_path)
            self._initialized = True
            logger.info("Deep Learning model initialized")
        except Exception as e:
            logger.warning(f"DL model initialization failed, training fresh: {e}")
            try:
                self._train_model(model_path)
            except Exception as e2:
                logger.error(f"DL model training also failed: {e2}")
                self._initialized = False

    def _train_model(self, model_path: str):
        """Train a simple feedforward neural network."""
        logger.info("Training deep learning model...")

        training_data = self._get_training_data()

        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.preprocessing import LabelEncoder

        texts = [item["text"] for item in training_data]
        labels = [item["label"] for item in training_data]

        self._vectorizer = TfidfVectorizer(max_features=500, ngram_range=(1, 2))
        X = self._vectorizer.fit_transform(texts).toarray()

        self._label_encoder = LabelEncoder()
        y_encoded = self._label_encoder.fit_transform(labels)
        self._classes = list(self._label_encoder.classes_)

        n_classes = len(self._classes)
        n_features = X.shape[1]

        # One-hot encode labels
        y_onehot = np.zeros((len(y_encoded), n_classes))
        for i, label in enumerate(y_encoded):
            y_onehot[i, label] = 1.0

        # Architecture: input -> 256 -> 128 -> 64 -> output
        np.random.seed(42)
        self._model = {
            "W1": np.random.randn(n_features, 256) * np.sqrt(2.0 / n_features),
            "b1": np.zeros((1, 256)),
            "W2": np.random.randn(256, 128) * np.sqrt(2.0 / 256),
            "b2": np.zeros((1, 128)),
            "W3": np.random.randn(128, 64) * np.sqrt(2.0 / 128),
            "b3": np.zeros((1, 64)),
            "W4": np.random.randn(64, n_classes) * np.sqrt(2.0 / 64),
            "b4": np.zeros((1, n_classes)),
        }

        # Training loop with mini-batch gradient descent
        learning_rate = 0.01
        epochs = 200
        batch_size = min(32, len(X))

        for epoch in range(epochs):
            indices = np.random.permutation(len(X))
            epoch_loss = 0.0
            n_batches = 0

            for start in range(0, len(X), batch_size):
                end = min(start + batch_size, len(X))
                batch_idx = indices[start:end]
                X_batch = X[batch_idx]
                y_batch = y_onehot[batch_idx]

                # Forward pass
                z1 = X_batch @ self._model["W1"] + self._model["b1"]
                a1 = self._relu(z1)
                z2 = a1 @ self._model["W2"] + self._model["b2"]
                a2 = self._relu(z2)
                z3 = a2 @ self._model["W3"] + self._model["b3"]
                a3 = self._relu(z3)
                z4 = a3 @ self._model["W4"] + self._model["b4"]
                a4 = self._softmax(z4)

                # Loss
                loss = -np.mean(np.sum(y_batch * np.log(a4 + 1e-8), axis=1))
                epoch_loss += loss
                n_batches += 1

                # Backward pass
                m = len(X_batch)
                dz4 = a4 - y_batch
                dW4 = a3.T @ dz4 / m
                db4 = np.mean(dz4, axis=0, keepdims=True)

                da3 = dz4 @ self._model["W4"].T
                dz3 = da3 * self._relu_derivative(z3)
                dW3 = a2.T @ dz3 / m
                db3 = np.mean(dz3, axis=0, keepdims=True)

                da2 = dz3 @ self._model["W3"].T
                dz2 = da2 * self._relu_derivative(z2)
                dW2 = a1.T @ dz2 / m
                db2 = np.mean(dz2, axis=0, keepdims=True)

                da1 = dz2 @ self._model["W2"].T
                dz1 = da1 * self._relu_derivative(z1)
                dW1 = X_batch.T @ dz1 / m
                db1 = np.mean(dz1, axis=0, keepdims=True)

                # Update weights
                self._model["W4"] -= learning_rate * dW4
                self._model["b4"] -= learning_rate * db4
                self._model["W3"] -= learning_rate * dW3
                self._model["b3"] -= learning_rate * db3
                self._model["W2"] -= learning_rate * dW2
                self._model["b2"] -= learning_rate * db2
                self._model["W1"] -= learning_rate * dW1
                self._model["b1"] -= learning_rate * db1

            if (epoch + 1) % 50 == 0:
                avg_loss = epoch_loss / max(n_batches, 1)
                logger.info(f"Epoch {epoch + 1}/{epochs}, Loss: {avg_loss:.4f}")

        # Save model
        os.makedirs(model_path, exist_ok=True)
        np.savez(
            os.path.join(model_path, "dl_model.npz"),
            W1=self._model["W1"], b1=self._model["b1"],
            W2=self._model["W2"], b2=self._model["b2"],
            W3=self._model["W3"], b3=self._model["b3"],
            W4=self._model["W4"], b4=self._model["b4"],
        )

        import joblib
        joblib.dump(self._vectorizer, os.path.join(model_path, "dl_vectorizer.pkl"))
        joblib.dump(self._label_encoder, os.path.join(model_path, "dl_label_encoder.pkl"))

        self._initialized = True
        logger.info(f"DL model trained: {len(training_data)} samples, {n_classes} classes")

    def _load_model(self, model_path: str):
        import joblib

        data = np.load(model_path)
        self._model = {
            "W1": data["W1"], "b1": data["b1"],
            "W2": data["W2"], "b2": data["b2"],
            "W3": data["W3"], "b3": data["b3"],
            "W4": data["W4"], "b4": data["b4"],
        }

        base_dir = os.path.dirname(model_path)
        self._vectorizer = joblib.load(os.path.join(base_dir, "dl_vectorizer.pkl"))
        self._label_encoder = joblib.load(os.path.join(base_dir, "dl_label_encoder.pkl"))
        self._classes = list(self._label_encoder.classes_)
        self._initialized = True
        logger.info("DL model loaded from disk")

    def predict(self, skills: List[str], raw_text: str = "") -> List[Dict]:
        if not self._initialized or self._model is None:
            return []

        text = " ".join(skills) + " " + raw_text
        X = self._vectorizer.transform([text]).toarray()

        # Forward pass
        z1 = X @ self._model["W1"] + self._model["b1"]
        a1 = self._relu(z1)
        z2 = a1 @ self._model["W2"] + self._model["b2"]
        a2 = self._relu(z2)
        z3 = a2 @ self._model["W3"] + self._model["b3"]
        a3 = self._relu(z3)
        z4 = a3 @ self._model["W4"] + self._model["b4"]
        probabilities = self._softmax(z4)[0]

        results = []
        for i, prob in enumerate(probabilities):
            if i < len(self._classes):
                results.append({
                    "role": self._classes[i],
                    "confidence": round(float(prob), 4),
                    "model": "deep_learning",
                })

        results.sort(key=lambda x: x["confidence"], reverse=True)
        return results[:5]

    @staticmethod
    def _relu(x):
        return np.maximum(0, x)

    @staticmethod
    def _relu_derivative(x):
        return (x > 0).astype(float)

    @staticmethod
    def _softmax(x):
        exp_x = np.exp(x - np.max(x, axis=1, keepdims=True))
        return exp_x / np.sum(exp_x, axis=1, keepdims=True)

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
                "Full Stack Developer": ["javascript react node.js express mongodb sql html css git rest api"],
                "Backend Developer": ["python django flask postgresql redis docker git rest api backend"],
                "Frontend Developer": ["javascript react html css tailwindcss git responsive design ui"],
                "Data Scientist": ["python pandas numpy scikit-learn matplotlib jupyter sql statistics"],
            }

        data = []
        for role, skill_sets in role_skill_sets.items():
            for skills_text in skill_sets:
                data.append({"text": skills_text, "label": role})

        logger.info(f"Loaded {len(data)} DL training samples across {len(role_skill_sets)} classes")
        return data

