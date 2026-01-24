# AI Safety Rail Guards

This project implements AI safety guardrails — systems that monitor, validate, and constrain AI behaviour. It intercepts prompts and model outputs, flagging or blocking unsafe or policy-violating content before reaching the user.

It includes:

* **Backend API**: Applies AI safety rules
* **Frontend UI**: Test and visualise guardrail behaviour
* **Docker Compose setup**: Build and run the system across platforms

---

## Features

* Monitor prompts and AI outputs
* Apply guardrail logic to catch unsafe responses
* Frontend interface for testing
* Cross-platform Docker Compose setup

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MR-Crisp/Ai_safety_rail_guards.git
cd Ai_safety_rail_guards
```

---

### 2. Install Docker and Docker Compose

#### macOS

**CLI-only setup:**

```bash
brew install docker
brew install docker-compose
brew install colima
colima start
```

> Colima must be running for Docker CLI commands to work.

**Or Docker Desktop** (includes Docker Engine and Compose):
[https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

---

#### Windows

Install **Docker Desktop for Windows**:
[https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

* Ensure **WSL2 backend** is enabled.

---

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl enable --now docker
sudo usermod -aG docker $USER  # optional for non-root usage
newgrp docker
```

---

#### Fedora/CentOS

```bash
sudo dnf install docker docker-compose -y
sudo systemctl enable --now docker
sudo usermod -aG docker $USER  # optional for non-root usage
newgrp docker
```

---

#### Arch Linux / Manjaro

```bash
sudo pacman -Syu docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER  # optional for non-root usage
newgrp docker
```

---

### 3. Verify Docker & Compose

```bash
docker --version
docker compose version
```

---

## Running the Project with Docker Compose

* **Start all services**

```bash
docker compose up --build
```

* **Detached mode**

```bash
docker compose up -d
```

* **Stop services**

```bash
docker compose down
```

* **View logs**

```bash
docker compose logs -f
```

Once running, access:

* **Frontend UI**: `http://localhost:3000`
* **Backend API**: `http://localhost:8000`

*(Adjust ports if changed in `docker-compose.yml`.)*

---

## Project Structure

### Backend

* Applies AI safety rules to incoming prompts and outputs
* Handles input validation and output checks

### Frontend

* Provides a UI for testing and visualising guardrails
* Displays flagged and safe AI responses

---

## Docker Compose Configuration

Example `docker-compose.yml`:

```yaml
version: '3.9'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
```

---

## Development Tips

* Rebuild after changes:

```bash
docker compose up --build
```

* Stop all containers:

```bash
docker compose down
```

* Follow logs:

```bash
docker compose logs -f
```

