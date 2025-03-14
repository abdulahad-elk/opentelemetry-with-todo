# NestJS Todo App with OpenTelemetry and GCP Integration

This is a simple Todo application built with NestJS that demonstrates the integration of OpenTelemetry with Google Cloud Platform (GCP) for distributed tracing and logging.

## Features

- Basic CRUD operations for Todo items
- OpenTelemetry integration for distributed tracing
- GCP Cloud Trace integration
- Automatic instrumentation for HTTP requests
- Manual instrumentation for business logic

## Prerequisites

- Node.js (v16 or later)
- npm
- Google Cloud Platform account
- Google Cloud SDK
- GCP project with Cloud Trace API enabled

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up GCP credentials:
   - Create a service account in your GCP project
   - Download the service account key JSON file
   - Set the environment variable:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
```

3. Configure your GCP project ID:

```bash
export GCLOUD_PROJECT="your-project-id"
```

## Running the Application

1. Start the application:

```bash
npm run start
```

2. The application will be available at `http://localhost:3000`

## API Endpoints

- `POST /todos` - Create a new todo
- `GET /todos` - Get all todos
- `GET /todos/:id` - Get a specific todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

### Example Request Bodies

Create/Update Todo:

```json
{
  "title": "Complete OpenTelemetry setup",
  "description": "Implement OpenTelemetry in the Todo application",
  "completed": false
}
```

## Viewing Traces

1. Open the Google Cloud Console
2. Navigate to Operations > Trace
3. You should see traces for your application's requests

## OpenTelemetry Features Implemented

- Automatic instrumentation for:

  - HTTP requests/responses
  - NestJS controllers and services
  - Node.js core modules

- Manual instrumentation for:
  - Todo service operations
  - Custom attributes for business context
  - Error tracking

## Next Steps

1. Add metrics collection
2. Implement custom samplers
3. Add more detailed business logic tracing
4. Implement custom exporters for specific needs

## Contributing

Feel free to submit issues and enhancement requests!
