# Notes App

Full-stack notes application with a React frontend, Spring Boot API, MySQL database, and Prometheus/Grafana monitoring.

## Project structure

```
.
├── backend/              # Spring Boot REST API (Java 17)
├── frontend/           # React + Vite UI
├── docker/
│   ├── docker-compose.prod.yml
│   ├── scripts/deploy.sh
│   ├── prometheus/
│   └── grafana/
└── .github/              # CI/CD pipeline
```

## Prerequisites

Choose one path below.

### Docker (recommended)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Docker Compose v2)
- Git

### Local development (without Docker)

- Git
- Java 17+
- Maven 3.9+ (or use the included `./mvnw` wrapper)
- Node.js 22+
- MySQL 8.0 running locally on port `3306`

---

## Quick start with Docker

The stack runs from `docker/docker-compose.prod.yml` using pre-built images published to GitHub Container Registry.

### 1. Clone the repository

```bash
git clone https://github.com/fatenke/test-technique.git
cd test-technique
```

### 2. Create environment file

```bash
cd docker
cp .env.example .env        # macOS / Linux
copy .env.example .env      # Windows (PowerShell or CMD)
```

Edit `docker/.env` and set real values (at minimum, change the passwords):

```env
MYSQL_ROOT_PASSWORD=your-secure-password
MYSQL_DATABASE=notes
DB_USER=root
DB_PASS=your-secure-password
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-secure-password
```

> `DB_PASS` must match `MYSQL_ROOT_PASSWORD` when using the `root` account.

### 3. Start the stack

From the `docker/` directory:

```bash
docker compose -f docker-compose.prod.yml --env-file .env pull
docker compose -f docker-compose.prod.yml --env-file .env up -d
```

### 4. Open the app

| Service     | URL                               |
|-------------|-----------------------------------|
| Frontend    | http://localhost:5173             |
| Backend API | http://localhost:8080/api/notes   |
| Prometheus  | http://localhost:9090             |
| Grafana     | http://localhost:3000             |

Log in to Grafana with the credentials from your `.env` file (`GRAFANA_ADMIN_USER` / `GRAFANA_ADMIN_PASSWORD`).

### 5. Stop the stack

```bash
docker compose -f docker-compose.prod.yml down
```

To also remove database volumes:

```bash
docker compose -f docker-compose.prod.yml down -v
```

---

## Deploy script

For updates after CI/CD has published new images to GHCR, use the deploy script:

```bash
cd docker
chmod +x scripts/deploy.sh   # first time only
./scripts/deploy.sh
```

The script:

1. Pulls the latest images from GHCR
2. Restarts all containers in detached mode
3. Prints running container status

Make sure `docker/.env` already exists before running the script.

---

## Local development (without Docker)

Run each service separately for faster iteration during development.

### 1. Start MySQL

Create a database (or let the app create it on first connect):

```sql
CREATE DATABASE notes;
```

### 2. Start the backend

From the `backend/` directory, set database environment variables and run Spring Boot:

**macOS / Linux**

```bash
cd backend
export DB_URL="jdbc:mysql://localhost:3306/notes?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false"
export DB_USER=root
export DB_PASS=your-mysql-password
./mvnw spring-boot:run
```

**Windows (PowerShell)**

```powershell
cd backend
$env:DB_URL="jdbc:mysql://localhost:3306/notes?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false"
$env:DB_USER="root"
$env:DB_PASS="your-mysql-password"
.\mvnw.cmd spring-boot:run
```

The API is available at http://localhost:8080.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. In dev mode, the frontend calls `http://localhost:8080/api/notes` directly. CORS is configured on the backend for `http://localhost:5173`.

---

## API

| Method | Endpoint            | Description    |
|--------|---------------------|----------------|
| GET    | `/api/notes`        | List all notes |
| POST   | `/api/notes`        | Create a note  |
| DELETE | `/api/notes/{id}`   | Delete a note  |

**Create note — request body**

```json
{
  "title": "My note",
  "description": "Optional description"
}
```

**Example**

```bash
curl http://localhost:8080/api/notes
```

---

## How networking works

| Environment | API URL used by the frontend |
|-------------|------------------------------|
| Local dev (`npm run dev`) | `http://localhost:8080/api/notes` |
| Docker (production image) | `/api/notes` (proxied by nginx to the backend) |

In Docker, nginx in the frontend container forwards `/api` requests to the backend service on the internal network. This keeps the browser on the same origin and avoids CORS issues.

---

## Environment variables

| Variable                 | Used by | Description                              |
|--------------------------|---------|------------------------------------------|
| `MYSQL_ROOT_PASSWORD`    | MySQL   | Root password for the database container |
| `MYSQL_DATABASE`         | MySQL   | Database name                            |
| `DB_USER`                | Backend | Database username                        |
| `DB_PASS`                | Backend | Database password                        |
| `DB_URL`                 | Backend | JDBC connection string (set by Compose)  |
| `GRAFANA_ADMIN_USER`     | Grafana | Grafana admin username                   |
| `GRAFANA_ADMIN_PASSWORD` | Grafana | Grafana admin password                   |

---

## Running tests

**Backend**

```bash
cd backend
./mvnw test          # macOS / Linux
.\mvnw.cmd test      # Windows
```

**Frontend build**

```bash
cd frontend
npm ci
npm run build
```

---

## Troubleshooting

### Backend does not start

- Confirm `docker/.env` exists and passwords are set.
- Ensure `DB_PASS` matches `MYSQL_ROOT_PASSWORD` when `DB_USER=root`.
- Check logs: `docker compose -f docker-compose.prod.yml logs backend`

### Frontend shows "Failed to fetch notes"

- Verify the backend is running: `curl http://localhost:8080/api/notes`
- Verify the nginx proxy: `curl http://localhost:5173/api/notes`
- Pull the latest images: `./scripts/deploy.sh`
- Access the app at http://localhost:5173 (not port 8080).

### Port already in use

Stop conflicting services or change the port mapping in `docker/docker-compose.prod.yml`.

### Deploy script fails to pull images

- Ensure you are logged in to GHCR if images are private.
- Confirm CI/CD has published images after the last push to `main`.

---

## CI/CD

On every push to `main`, GitHub Actions:

1. Runs backend tests
2. Builds the frontend
3. Builds and pushes Docker images to `ghcr.io/fatenke/notes-backend` and `ghcr.io/fatenke/notes-frontend`

After a successful pipeline run, deploy the new version with:

```bash
cd docker
./scripts/deploy.sh
```

See [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) for details.
