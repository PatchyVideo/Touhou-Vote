# Frontend Deployment Compose

This directory contains the frontend-only Docker Compose definition for
deployment.

## Purpose

- Deploy `vote`, `navigator`, and `result` independently from the backend.
- Reuse the shared external Docker network `thvote-net`.
- Let frontend and backend communicate over the same internal network without
  bundling them into one compose stack.

## Usage

Create the external network once on the target host:

```bash
docker network create thvote-net
```

Create the environment file from the matching example and adjust image tags if needed:

```bash
cp docker/.env.test.example docker/.env.test
cp docker/.env.prod.example docker/.env.prod
```

Start or update frontend services:

```bash
docker compose --env-file docker/.env.test -f docker/docker-compose.yml up -d
```

Start or update a single service:

```bash
docker compose --env-file docker/.env.test -f docker/docker-compose.yml up -d vote
docker compose --env-file docker/.env.test -f docker/docker-compose.yml up -d navigator
docker compose --env-file docker/.env.test -f docker/docker-compose.yml up -d result
```
