.PHONY: dev frontend backend install

dev:
	@echo "Starting frontend and backend..."
	$(MAKE) -j2 frontend backend

frontend:
	cd frontend && npm run dev

backend:
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000

install:
	cd frontend && npm install
	cd backend && .venv/bin/pip install -r requirements.txt
