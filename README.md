# 🛡️ AI Safety Rail Guards

This project implements **AI safety guardrails** — systems that monitor, validate, and constrain AI behaviour. It intercepts prompts and model outputs, flagging or blocking unsafe or policy-violating content before reaching the user.

It includes:

* **Backend API**: Applies AI safety rules
* **Frontend UI**: Test and visualise guardrail behaviour
* **Docker Compose setup**: Easily build and run the system across platforms

---

## 🚀 Features

* 🚨 Monitor prompts and AI outputs
* 🧠 Apply guardrail logic to catch unsafe responses
* 🖥️ Frontend interface for testing
* 🐳 Cross-platform Docker Compose setup

---

## 💻 Installation

### **1. Clone the Repository**

```bash
git clone https://github.com/MR-Crisp/Ai_safety_rail_guards.git
cd Ai_safety_rail_guards
```

---

### **2. Install Docker & Docker Compose**

#### **macOS**

* **Docker CLI and Compose**

```bash
brew install docker
brew install docker-compose
```

* **Colima (Docker backend for CLI-only setup)**

```bash
brew install colima
colima start
```

> Colima must be running for Docker CLI commands to work.

* **Alternatively**, you can install **Docker Desktop for Mac** which includes Docker Engine and Compose.

---

#### **Windows**

* **Install Docker Desktop for Windows**:
  [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

  * Docker Desktop includes Docker Engine and Docker Compose.
  * Make sure to enable **WSL2 backend** for Windows Subsystem for Linux.

---

#### **Linux**

* **Ubuntu/Debian**

```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl enable --now docker
```

* **Fedora/CentOS**

```bash
sudo dnf install docker docker-compose -y
sudo systemctl enable --now docker
```

* **Add your user to Docker group (optional for non-root usage)**

```bash
sudo usermod -aG docker $USER
newgrp docker
```

* Verify installation:

```bash
docker --version
docker compose version
```

---

### **3. Run the Project with Docker Compose**

* **Start all services**

```bash
docker compose up --build
```

* **Run in detached mode**

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

Once started, access:

* **Frontend UI**: `http://localhost:3000`
* **Backend API**: `http://localhost:8000`

*(Adjust ports if changed in `docker-compose.yml`.)*

---

## 🧱 Project Structure

### **Backend**

* Handles AI safety rules and logic
* Validates prompts and model outputs

### **Frontend**

* Provides an interface for testing
* Displays flagged or safe AI responses

---

## 📄 Docker Compose Configuration

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

## 🔧 Development Tips

* Rebuild after changes:

```bash
docker compose up --build
```

* Stop all containers:

```bash
docker compose down
```

* Check logs:

```bash
docker compose logs -f
```

