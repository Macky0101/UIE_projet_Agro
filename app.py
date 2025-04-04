from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Chargement des modèles
model_eau = joblib.load('models/modele_besoin_eau.pkl')
model_culture = joblib.load('models/model_culture.pkl')
encoder = joblib.load('models/encoder_sol.pkl')
# Assurez-vous d'avoir aussi le scaler si nécessaire
scaler = joblib.load('models/scaler.pkl')  # Ajoutez ce fichier si vous utilisez un scaler

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict_eau', methods=['POST'])
def predict_eau():
    try:
        # Récupérer les données du formulaire
        temperature = float(request.form.get('temperature'))
        humidity = float(request.form.get('humidity'))
        ph = float(request.form.get('ph', 6.5))  # Valeur par défaut si non fournie
        rainfall = float(request.form.get('rainfall', 10))  # Valeur par défaut si non fournie
        temp_min = float(request.form.get('temp_min', temperature-5))  # Estimation si non fournie
        temp_max = float(request.form.get('temp_max', temperature+5))  # Estimation si non fournie
        soil_type = request.form.get('soil_type', 'loam')
        
        # Conversion des types de sol de l'interface vers votre modèle
        soil_type_mapping = {
            'clay': 'argileux',
            'loam': 'limoneux',
            'sandy': 'sablé',
            'silt': 'silteux'
        }
        
        type_sol = soil_type_mapping.get(soil_type, 'sablé')
        
        # Encoder le type de sol
        type_sol_encoded = encoder.transform([type_sol])[0]

        # Créer un DataFrame avec les features
        features = pd.DataFrame([{
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall,
            "Température min (°C)": temp_min,
            "Température max (°C)": temp_max,
            "sol_encoded": type_sol_encoded
        }])

        # Standardiser
        features_scaled = scaler.transform(features)

        # Prédiction
        prediction = model_eau.predict(features_scaled)[0]
        
        return jsonify({'water_amount': f"{prediction:.2f} mm/cycle"})
    
    except Exception as e:
        print(f"Erreur lors de la prédiction d'eau: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict_culture', methods=['POST'])
def predict_culture():
    try:
        # Récupérer les données du formulaire
        nitrogen = float(request.form.get('nitrogen'))
        phosphorus = float(request.form.get('phosphorus'))
        potassium = float(request.form.get('potassium'))
        temperature = float(request.form.get('avg_temperature'))
        humidity = float(request.form.get('humidity', 60))  # Valeur par défaut si non fournie
        ph = float(request.form.get('ph'))
        rainfall = float(request.form.get('rainfall'))
        
        # Prédiction avec le modèle
        sample = pd.DataFrame([{
            "N": nitrogen, 
            "P": phosphorus, 
            "K": potassium,
            "temperature": temperature,
            "humidity": humidity,
            "ph": ph,
            "rainfall": rainfall
        }])
        
        prediction = model_culture.predict(sample)[0]
        
        # Pour une meilleure présentation, vous pourriez avoir un dictionnaire de descriptions
        crop_descriptions = {
            "riz": "Idéal pour vos conditions de sol avec une bonne efficacité hydrique.",
            "maïs": "Bonne option avec un bon rendement dans ces conditions.",
            "pois chiche": "Excellent choix pour enrichir votre sol en azote.",
            "haricot mungo": "Adapté à vos conditions climatiques avec peu d'entretien.",
            "blé": "Culture robuste qui s'adapte bien à vos paramètres de sol.",
            "noix de coco": "Bon choix pour un investissement à long terme.",
            "papaye": "Fruit tropical qui prospère dans ces conditions.",
            "orange": "Agrume qui s'adapte bien à votre type de sol.",
            "pomme": "Fruit tempéré qui peut bien se développer avec ces paramètres.",
            "coton": "Culture commerciale adaptée à vos conditions."
            # Ajoutez d'autres cultures selon votre modèle
        }
        
        # Créer une réponse avec la culture prédite et sa description
        confidence = np.random.randint(70, 95)  # Simuler un score de confiance
        
        recommendations = [
            {
                'name': prediction,
                'confidence': confidence,
                'description': crop_descriptions.get(prediction.lower(), "Recommandé pour vos conditions de sol et de climat.")
            }
        ]
        
        # Ajouter quelques autres recommandations alternatives
        all_crops = list(crop_descriptions.keys())
        for _ in range(2):
            alt_crop = np.random.choice(all_crops)
            alt_confidence = confidence - np.random.randint(10, 25)
            if alt_confidence < 50:
                alt_confidence = 50
                
            recommendations.append({
                'name': alt_crop.title(),
                'confidence': alt_confidence,
                'description': crop_descriptions.get(alt_crop, "Alternative possible pour vos conditions.")
            })
        
        return jsonify({'recommendations': recommendations})
    
    except Exception as e:
        print(f"Erreur lors de la prédiction de culture: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)