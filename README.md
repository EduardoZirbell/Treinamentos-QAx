# Playwright eXpress (Playwright_Express-QAX)

Requisitos
- Node.js 18+ (recomenda-se 20)
- npm e/ou yarn
- Playwright (browsers instalados via `yarn playwright install`)

Execução local (PowerShell)

1. Iniciar API:

```powershell
cd mark/api
yarn install
yarn run db:init
yarn start
```

2. Iniciar frontend:

```powershell
cd mark/web
yarn install
yarn start
```

3. Rodar testes Playwright:

```powershell
cd playwright
yarn install
yarn playwright install 
$env:CI = "true"
$env:BASE_API = "http://127.0.0.1:3333"
$env:BASE_URL = "http://127.0.0.1:8080"
yarn playwright test
```

Ver relatório local:

```powershell
yarn playwright show-report
```

Contribuições e ajustes
- Ajuste as URLs em `playwright/.env` ou nas variáveis de ambiente conforme necessário.
- O repositório inclui um workflow de CI em `.github/workflows/playwright.yml` para execução no GitHub Actions.