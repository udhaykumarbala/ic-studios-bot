# IC Studios Chat Assistant

A Flask-based chat application using Google's Gemini AI to provide an interactive assistant for IC Studios' website.

## Features

- Interactive chat interface with Lily, the IC Studios assistant
- Message history management (last 5 messages)
- Real-time typing indicators
- Docker support for easy deployment
- Modern, comic-themed UI
- Configurable CORS support

## Setup

### Using Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Create a `.env` file in the project root:
```bash
GOOGLE_API_KEY=your_google_api_key_here
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```
3. Run the application:
```bash
docker-compose up --build
```
4. Access the application at `http://localhost:8080`

### Manual Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your environment variables:
```bash
export GOOGLE_API_KEY=your_google_api_key_here
export ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

3. Run the Flask application:
```bash
python app.py
```

## CORS Configuration

The application supports configurable CORS settings through the `ALLOWED_ORIGINS` environment variable:

- Default: `*` (allows all origins)
- Specific origins: Comma-separated list of allowed origins
  Example: `http://localhost:3000,https://yourdomain.com`

CORS is configured to allow:
- GET, POST, and OPTIONS methods
- Content-Type and Authorization headers
- Credentials (if needed)

## API Usage

### Chat Endpoint

**URL**: `/chat`
**Method**: `POST`
**Content-Type**: `application/json`

#### Request Format
```json
{
    "messages": [
        "Hello",
        "Tell me about your comics",
        "What's the price of HOT BLOOD?"
    ]
}
```

- The `messages` array should contain the conversation history
- The last message in the array is treated as the current question
- The array is automatically trimmed to the last 5 messages
- Each message should be a string

#### Response Format
```json
{
    "response": "HOT BLOOD is priced at $4.99 and will be released in June 2025. It's an action-packed thriller created by Sundaramurthy Murugan and beautifully illustrated by Unnikrishnan V.S and Rithun Volga.",
    "history": [
        "Hello",
        "Tell me about your comics",
        "What's the price of HOT BLOOD?",
        "HOT BLOOD is priced at $4.99 and will be released in June 2025. It's an action-packed thriller created by Sundaramurthy Murugan and beautifully illustrated by Unnikrishnan V.S and Rithun Volga."
    ]
}
```

- `response`: The assistant's reply to the latest message
- `history`: The updated conversation history (last 5 messages)

#### Example Usage with curl
```bash
curl -X POST http://localhost:8080/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": ["Hello", "Tell me about HOT BLOOD"]}'
```

#### Example Usage with Python
```python
import requests

url = "http://localhost:8080/chat"
messages = ["Hello", "Tell me about HOT BLOOD"]

response = requests.post(url, json={"messages": messages})
data = response.json()

print("Assistant's response:", data["response"])
print("Updated history:", data["history"])
```

## Error Handling

The API will return appropriate error messages in case of:
- Missing messages array
- Invalid API key
- Server errors

Error Response Format:
```json
{
    "error": "Error message here"
}
```

## Development

### Project Structure
```
.
├── app.py              # Main Flask application
├── system_prompt.py    # AI assistant configuration
├── requirements.txt    # Python dependencies
├── templates/         # HTML templates
│   └── index.html     # Chat interface
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── .env              # Environment variables
```

### Running Tests
```bash
# Add your test commands here
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 