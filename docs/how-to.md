# How to use

## Layout

- `frontend/` - UI
- `backend/` - API/services
- `infra/` - infrastructure-as-code

## Run locally

### Backend

```bash
cd backend
# install deps per backend README/package.json
```

### Frontend

```bash
cd frontend
# install deps per frontend README/package.json
```

## Deploy

- Use `infra/` for provisioning/deployment.
- Document required environment variables/secrets in `infra/` and/or `docs/`.
