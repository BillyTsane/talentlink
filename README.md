# 🚀 TalentLink – Full-Stack Cloud-native DevSecOps Platform

> **Connecting sports talents with clubs, agents and recruiters through video performance and smart discovery.**

[![CI/CD Pipeline](https://github.com/BillyTsane/talentlink/actions/workflows/ci.yml/badge.svg)](https://github.com/BillyTsane/talentlink/actions)
[![Security Scan](https://img.shields.io/badge/security-trivy%20%7C%20bandit%20%7C%20sonarqube-brightgreen)](https://github.com/BillyTsane/talentlink/actions)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11-blue)](https://www.python.org/)
[![Django](https://img.shields.io/badge/django-4.2-green)](https://www.djangoproject.com/)

---

## 📌 What is TalentLink?

TalentLink is a **cloud-native sports talent discovery platform** built with a full DevSecOps pipeline. It demonstrates end-to-end engineering ownership: from API design and containerized deployment to AWS cloud infrastructure, automated security scanning and production-grade monitoring.

**Key highlights:**
- 🏗️ Scalable cloud architecture on **AWS ECS/EKS** with **Terraform IaC**
- 🔐 **Security-as-Code**: Trivy, Bandit, pip-audit, SonarQube in every CI run
- 🚀 Fully automated **GitHub Actions CI/CD** pipeline
- 📊 **Prometheus + Grafana** monitoring stack
- 📖 **Swagger/OpenAPI** documented REST API

---

## 🧱 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        GitHub Actions CI/CD                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Lint &  │→ │ Security │→ │  Build & │→ │ Deploy   │   │
│  │   Test   │  │  Scans   │  │  Docker  │  │  to AWS  │   │
│  │          │  │Trivy/ZAP │  │  Image   │  │ ECS/EKS  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                        AWS Infrastructure (Terraform)         │
│                                                              │
│  CloudFront CDN → ALB → ECS/EKS (Django + React)            │
│                         ↓                                    │
│              RDS (PostgreSQL) + ElastiCache (Redis)          │
│                         ↓                                    │
│              S3 (Media/Static) + CloudWatch Logs             │
│                                                              │
│  Monitoring: Prometheus → Grafana Dashboards                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Django 4.2, Django REST Framework, Celery |
| **Frontend** | React 18, Axios, Tailwind CSS |
| **Database** | PostgreSQL 15, Redis 7 |
| **Storage** | AWS S3 |
| **Container** | Docker, Docker Compose |
| **Orchestration** | Kubernetes (AWS EKS) |
| **IaC** | Terraform (AWS provider) |
| **CI/CD** | GitHub Actions |
| **Security** | Trivy, Bandit, pip-audit, SonarQube |
| **Monitoring** | Prometheus, Grafana |
| **API Docs** | Swagger / OpenAPI 3.0 |

---

## ⚙️ CI/CD Pipeline

Every pull request and push to `main` triggers the full pipeline:

```yaml
1. Code Quality    → flake8 linting, black formatting
2. Unit Tests      → pytest with coverage report
3. Security Scans  → Bandit (Python SAST)
                   → pip-audit (dependency vulnerabilities)
                   → Trivy (Docker image scanning)
                   → SonarQube (code quality & security hotspots)
4. Docker Build    → Build & push to GitHub Container Registry
5. Deploy          → AWS ECS/EKS via Terraform
```

---

## 🔐 Security (DevSecOps)

Security is integrated into every stage of the pipeline, not bolted on at the end:

- **Bandit** – Static analysis for common Python security issues
- **pip-audit** – Scans Python dependencies for known CVEs
- **Trivy** – Container image vulnerability scanning (CRITICAL/HIGH fail the build)
- **SonarQube** – Code quality gates and security hotspot detection

Pipeline fails automatically on any CRITICAL vulnerability.

---

## 🚀 Local Setup

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+

### Start the full stack

```bash
git clone https://github.com/BillyTsane/talentlink.git
cd talentlink
cp .env.example .env
docker-compose up --build
```

| Service | URL |
|---|---|
| API (Django) | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/api/docs/ |
| Frontend (React) | http://localhost:3000 |
| Grafana Dashboard | http://localhost:3001 |
| Prometheus | http://localhost:9090 |

---

## 📁 Project Structure

```
talentlink/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD pipeline
├── backend/
│   ├── apps/
│   │   ├── users/              # User management & auth (JWT)
│   │   ├── talents/            # Talent profiles & videos
│   │   ├── clubs/              # Club & agent management
│   │   └── discovery/          # Search & matching engine
│   ├── config/                 # Django settings
│   └── requirements.txt
├── docs/
│   └── architecture.md         # Full architecture documentation
├── Dockerfile
├── docker-compose.yml
├── sonar-project.properties    # SonarQube configuration
└── README.md
```

---

## 🌍 Cloud Infrastructure (Terraform)

Infrastructure is fully managed as code:

```
terraform/
├── modules/
│   ├── vpc/           # VPC, subnets, security groups
│   ├── ecs/           # ECS cluster & task definitions
│   ├── rds/           # PostgreSQL RDS instance
│   ├── s3/            # S3 buckets for media
│   └── cloudfront/    # CDN distribution
└── environments/
    ├── dev/
    └── prod/
```

---

## 📊 Monitoring

The platform ships with a pre-configured monitoring stack:

- **Prometheus** scrapes metrics from Django, Celery, PostgreSQL and Redis
- **Grafana** dashboards for API latency, error rates, database performance
- **Alerting** configured for high error rate and service downtime

---

## 🤝 Contributing

Pull requests welcome. For major changes please open an issue first.

---

## 📄 License

[MIT](LICENSE) © 2025 Billy Max Tsane Tsafack
