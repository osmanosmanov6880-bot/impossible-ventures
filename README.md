# Impossible Ventures

An experimental portfolio of seven independent creative-technology ventures. **Two working browser demos**, five concepts.

## Run locally

```bash
git clone https://github.com/osmanosmanov6880-bot/impossible-ventures.git
cd impossible-ventures
python3 -m http.server 8000
```

Open:
- **Portfolio:** http://localhost:8000/
- **Dead Drop Agency:** http://localhost:8000/apps/dead-drop/
- **Appeal 2049:** http://localhost:8000/apps/appeal-2049/

These are static demos. They require no account or API keys and send no campaign data to a server.

## Portfolio status

| Venture | Status |
|---|---|
| Dead Drop Agency | Interactive browser prototype |
| Appeal 2049 | Interactive browser prototype |
| AntiPersona | Concept |
| Brief Theatre | Concept |
| AdBiome | Concept |
| Museum of Attention | Concept |
| Attention Republic | Concept |

See [portfolio architecture](docs/portfolio.md) and [release roadmap](docs/roadmap.md).

## Validation

GitHub Actions checks that all three HTML entrypoints exist and contain basic document metadata. This is **not** a browser test or production security audit.

## Production gaps

No deployed domain, real AI model, authentication, multiplayer, persistence, payments, or legal company registrations. Brand and domain availability are unverified. Do not commit secrets or private customer data.
