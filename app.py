from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Chargement des modèles
model_eau = joblib.load('models/modele_besoin_eau.pkl')
model_culture = joblib.load('models/model_culture.pkl')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict_eau', methods=['POST'])
def predict_eau():
    # Récupérer les données du formulaire
    temperature = float(request.form.get('temperature'))
    humidity = float(request.form.get('humidity'))
    soil_type = request.form.get('soil_type')
    plant_type = request.form.get('plant_type')
    sunlight = float(request.form.get('sunlight'))
    
    # Prétraitement des données (à adapter selon votre modèle)
    # ...
    
    # Prédiction avec le modèle
    # prediction = model_eau.predict([[temperature, humidity, ...]])
    
    # Pour la démo, on retourne une valeur aléatoire
    prediction = np.random.randint(100, 600)
    
    return jsonify({'water_amount': int(prediction)})

@app.route('/predict_culture', methods=['POST'])
def predict_culture():
    # Récupérer les données du formulaire
    nitrogen = float(request.form.get('nitrogen'))
    phosphorus = float(request.form.get('phosphorus'))
    potassium = float(request.form.get('potassium'))
    ph = float(request.form.get('ph'))
    rainfall = float(request.form.get('rainfall'))
    region = request.form.get('region')
    avg_temperature = float(request.form.get('avg_temperature'))
    
    # Prétraitement des données (à adapter selon votre modèle)
    # ...
    
    # Prédiction avec le modèle
    # predictions = model_culture.predict_proba([[...]])
    
    # Pour la démo, on retourne des valeurs fixes
    recommendations = [
        {
            'name': 'Blé',
            'confidence': 85,
            'description': 'Idéal pour vos conditions de sol avec une bonne efficacité hydrique.'
        },
        {
            'name': 'Orge',
            'confidence': 72,
            'description': 'Bonne alternative avec des conditions de croissance similaires.'
        },
        {
            'name': 'Maïs',
            'confidence': 65,
            'description': 'Option possible mais peut nécessiter plus d\'eau.'
        }
    ]
    
    return jsonify({'recommendations': recommendations})

if __name__ == '__main__':
    app.run(debug=True)