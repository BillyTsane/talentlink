# TalentLink GitHub Actions Pack

Place the `.github` folder from this archive at the root of your GitHub repository.

Included:
- `.github/workflows/ci.yml`
- `.github/workflows/security.yml`
- `.github/workflows/docker.yml`
- `.github/workflows/container-security.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/dependabot.yml`

## Next steps
1. Copy `.github/` into your repo root.
2. Commit and push to GitHub.
3. Open the **Actions** tab and review pipeline runs.
4. Add GitHub Secrets in:
   - Settings → Secrets and variables → Actions

Recommended secrets:
- DJANGO_SECRET_KEY
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_HOST
- POSTGRES_PORT
- REDIS_URL
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_STORAGE_BUCKET_NAME
- AWS_S3_REGION_NAME
