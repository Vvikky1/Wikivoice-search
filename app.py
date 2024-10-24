from flask import Flask, request, jsonify, render_template
import pyttsx3
import wikipedia

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file in request'}), 400

    audio_file = request.files['audio']
    audio_file.save('uploaded_audio.webm')
    
    return jsonify({'message': 'File received successfully'})

@app.route('/search', methods=['POST'])
def search_wikipedia():
    data = request.get_json()
    query = data.get('query', '')

    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        result = wikipedia.summary(query, sentences=2)
        
        # Text-to-Speech
        engine = pyttsx3.init()
        engine.say(result)
        engine.runAndWait()
        
        return jsonify({'result':result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
