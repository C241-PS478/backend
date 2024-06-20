# WaterWise Main Backend Service

This is the main backend API service for the WaterWise project, built using Hapi.js (Node.js).

## Development Usage

Ensure you have Node.js and PostgreSQL installed on your machine. You can install Node.js from [here](https://nodejs.org/en/download/) and PostgreSQL from [here](https://www.postgresql.org/download/).

Assuming you have the copy of this source code (cloned the repository), you can start by installing the required dependencies.

```bash
npm install
```

Prepare the environment variables by creating a `.env` file in the root directory of the project. You can copy the `.env.example` file and rename it to `.env`. Edit the values of the variables to match what you have.

```bash
cp .env.example .env
nano .env	# or use your favorite text editor
```

You should obtain the service account key from Google Cloud Platform and put the path of it on `GOOGLE_APPLICATION_CREDENTIALS` environment variable. You can also use Google Cloud SDK to authenticate your account. This key should have access to the Firestore database, Firebase Authentication, and Google Cloud Storage.

For `GEOCODING_API_KEY`, this should be set to the API key for Google Maps Geocoding API. You can also obtain this from Google Cloud Platform.

The database needs to be set up. Set it up Prisma CLI. You should do this everytime you make changes to the schema.

```bash
npx prisma generate
npx prisma migrate dev
```

After this, you can start the server. Any changes that is made on source code will be automatically reflected in the server.

```bash
npm start
```

The server will be running on `http://localhost:3000`.

## Deployment

The service can be deployed using Docker. Build the Docker image.

```bash
docker build -t backend .
```

Run the Docker container.

```bash
docker run -p 3000:3000 backend
```

Or, you can deploy it to Cloud Run.

```bash
# Upload to Docker Hub, Artifacts Registry, or any other container registry
docker push image-name:latest
# Deploy to Cloud Run
gcloud run deploy --image image-name:latest
```

You can also use Buildpacks to deploy the service to Google Cloud.

```bash
gcloud builds submit --pack image=gcr.io/PROJECT_ID/backend
# run it on Google Cloud Run
gcloud run deploy --image gcr.io/PROJECT_ID/backend
```
