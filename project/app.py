from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os

# Configure Google Generative AI with your API key
GOOGLE_API_KEY = "AIzaSyCLkWPKyYurxe-NXiOowni1UwfsnlcbMek"  
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the Generative Model
model = genai.GenerativeModel('gemini-1.5-flash')
chat = model.start_chat(history=[])

# Create Flask application
app = Flask(__name__)

@app.route('/')
def index():
    """Render the main chat interface."""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat_response():
    """Process chat requests and return AI responses."""
    # Get user message from request
    user_input = request.json.get('message')
    
    # Validate input
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        # Send message to Gemini and get response
        response_raw = chat.send_message(user_input)
        response = response_raw.text
        
        return jsonify({"response": response})
    
    except Exception as e:
        # Handle any errors during processing
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)