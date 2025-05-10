# Akira- Your AI Chatbot

Akira is an elegant, user-friendly AI chatbot powered by Google's Gemini model and Flask. It features a modern interface with line-by-line responses for better readability.

## Demo video
https://drive.google.com/drive/folders/1vn-Xhv_83CkhUKHLLdio_a5IznZsTzZr?usp=sharing

## Features

- Beautiful, responsive web interface
- Welcome greeting on initial load
- Line-by-line formatted responses
- Smooth typing animation for responses
- Visual typing indicators
- Message timestamps
- Responsive design for all devices

## Setup Instructions

1. Install the required dependencies:
   ```
   pip install flask google-generativeai
   ```

2. Add your Google API key:
   Open `app.py` and replace the empty `GOOGLE_API_KEY` string with your actual API key.

3. Run the application:
   ```
   python app.py
   ```

4. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000/
   ```

## Project Structure

- `app.py` - Flask application and backend logic
- `templates/index.html` - Main HTML structure
- `static/css/styles.css` - Styling for the chatbot interface
- `static/js/chat.js` - Frontend JavaScript for handling chat interactions

## Requirements

- Python 3.7+
- Flask
- Google Generative AI Python SDK

## License

This project is available for personal and commercial use.
