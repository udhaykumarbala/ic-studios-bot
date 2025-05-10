from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from dotenv import load_dotenv
import os
from system_prompt import SYSTEM_PROMPT
from collections import deque

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure Gemini
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-2.0-flash')

# Initialize chat with system prompt
chat = model.start_chat(history=[])
chat.send_message(SYSTEM_PROMPT)

# Store message history for each session
message_history = deque(maxlen=5)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat_endpoint():
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        
        if not messages:
            return jsonify({'error': 'Messages are required'}), 400

        # Get the latest message (last item in the array)
        latest_message = messages[-1]
        
        # Update message history
        message_history.append(latest_message)
        
        # Generate response using Gemini with context
        response = chat.send_message(latest_message)
        
        # Add the response to history
        message_history.append(response.text)
        
        return jsonify({
            'response': response.text,
            'history': list(message_history)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True) 