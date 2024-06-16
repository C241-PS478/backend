# WaterWise Main Backend Service

This is the main backend API service for the WaterWise project, built using Hapi.js (Node.js).

## Usage

Ensure you have Node.js installed on your machine. You can download it [here](https://nodejs.org/en/download/).

Assuming you have the copy of this source code (cloned the repository), you can start by installing the required dependencies.

```bash
npm install
```

Prepare the environment variables by creating a `.env` file in the root directory of the project. You can copy the `.env.example` file and rename it to `.env`. Edit the values of the variables to match what you have.

```bash
cp .env.example .env
nano .env	# or use your favorite text editor
```

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

You can also use Buildpacks to deploy the service to Google Cloud.

```bash
gcloud builds submit --pack image=gcr.io/PROJECT_ID/backend
# run it on Google Cloud Run
gcloud run deploy --image gcr.io/PROJECT_ID/backend
```
