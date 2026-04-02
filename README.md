# Todo API

A simple RESTful API for managing todos. Built with Node.js, Express, and MongoDB.

## Features

- Create, Read, Update, Delete todos
- MongoDB database with Mongoose
- RESTful API endpoints
- Input validation
- Automatic timestamps

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemon (development)

## Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB Atlas account (free) or local MongoDB

## Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd todo-api
```

2. Install dependencies
```bash
npm install
```

3. Create a .env file
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Run the server
```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Welcome message |
| GET | /todos | Get all todos |
| GET | /todos/:id | Get single todo |
| POST | /todos | Create a todo |
| PUT | /todos/:id | Update a todo |
| DELETE | /todos/:id | Delete a todo |

## Request Examples

### Create a Todo (POST /todos)
```json
{
    "title": "Learn backend",
    "description": "Build a REST API",
    "completed": false
}
```

### Update a Todo (PUT /todos/:id)
```json
{
    "title": "Updated title",
    "completed": true
}
```

## Response Examples

### Get All Todos (GET /todos)
```json
[
    {
        "_id": "65abc123def4567890123456",
        "title": "Learn backend",
        "description": "Build a REST API",
        "completed": false,
        "createdAt": "2024-01-20T10:00:00.000Z",
        "updatedAt": "2024-01-20T10:00:00.000Z"
    }
]
```

### Create Todo Response (POST /todos)
```json
{
    "_id": "65abc123def4567890123456",
    "title": "Learn backend",
    "description": "Build a REST API",
    "completed": false,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

## Testing with Postman

1. Start your server with `npm run dev`
2. Open Postman
3. Test each endpoint:

POST http://localhost:3000/todos
- Body -> raw -> JSON
- Send the create todo JSON

GET http://localhost:3000/todos

GET http://localhost:3000/todos/YOUR_ID_HERE

PUT http://localhost:3000/todos/YOUR_ID_HERE
- Body -> raw -> JSON
- Send the update todo JSON

DELETE http://localhost:3000/todos/YOUR_ID_HERE

## Testing with cURL

Create a todo:
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn cURL","completed":false}'
```

Get all todos:
```bash
curl http://localhost:3000/todos
```

Update a todo:
```bash
curl -X PUT http://localhost:3000/todos/YOUR_ID \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

Delete a todo:
```bash
curl -X DELETE http://localhost:3000/todos/YOUR_ID
```

## Project Structure

```
todo-api/
├── models/
│   └── Todo.js
├── routes/
│   └── todoRoutes.js
├── .env
├── package.json
└── server.js
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection error | Check your MONGODB_URI in .env |
| Port already in use | Change PORT in .env |
| Module not found | Run `npm install` |
| Invalid ID format | Use valid 24-character MongoDB ID |

## Deployment

Deploy to Render (free):
1. Push code to GitHub
2. Sign up at render.com
3. Create new Web Service
4. Connect your repository
5. Add MONGODB_URI environment variable
6. Deploy

## License

MIT License
```