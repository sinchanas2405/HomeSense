# HomeSense – AI Smart Home Device Diagnosis

A full-stack starter application using React + Vite, Flask, SQLAlchemy and SQLite.
It includes authentication, device management, rule-based fault diagnosis, inference traces,
algorithm endpoints, experiments and diagnosis history.

## Requirements
- Python 3.10+
- Node.js 18+

## Run backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env   # Windows; use cp on macOS/Linux
python app.py
```
Backend: http://127.0.0.1:5000

## Run frontend (new terminal)
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
Frontend: http://localhost:5173

## Demo
Register a user, add a device, then use Diagnose. The built-in knowledge base is illustrative:
adapt the rules to the actual devices and fault labels you want to support. This is a decision-support
demo, not a replacement for a qualified electrician or manufacturer service guidance.

## Main API
- POST `/api/auth/register`, `/api/auth/login`
- GET `/api/devices`, POST `/api/devices`
- POST `/api/diagnosis`
- GET `/api/diagnosis/history`
- GET `/api/knowledge/rules`
- GET `/api/algorithms`
- POST `/api/experiments/run`
- GET `/api/dashboard`
