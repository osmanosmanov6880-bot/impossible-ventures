# Impossible Ventures

Seven independent creative-technology ventures in one portfolio.

## First working prototype

Open [Dead Drop Agency](apps/dead-drop/index.html) in a browser. No installation or API key is required. The demo uses deterministic rules and does not send data to a server.

## Seven ventures

1. Dead Drop Agency — campaign creation missions (working browser prototype)
2. Appeal 2049 — adversarial review of advertising ideas (planned)
3. AntiPersona — creativity training (planned)
4. Brief Theatre — scripts from evolving briefs (planned)
5. AdBiome — creative variant exploration (planned)
6. Museum of Attention — interactive creative exhibits (planned)
7. Attention Republic — collaborative creative challenges (planned)

See [portfolio architecture](docs/portfolio.md).

## Local launch

From the repository root:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000/apps/dead-drop/

## Current limits

No production deployment, authentication, persistence, payments, multiplayer, or real AI model. Brand and domain availability have not been verified. Do not commit secrets or user data.
