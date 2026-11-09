---
name: deploy-k8s
description: Use when adding Kubernetes (k3s + Helm + ArgoCD) deployment to an app in a monorepo scaffolded from this template — creating apps/<name>/k8s/chart, a GHCR build-push workflow, an ArgoCD Application, Infisical secrets, an Ingress/TLS host, or when asked "deploy to k8s", "add helm chart", "release image", "homeport".
---

# Deploy an app to the homeport k3s cluster

Pattern copied from `homeport-personal-apps` (charts) and `homeport-infrastructure-apps`
(cluster, ArgoCD). Cluster setup (k3s, Helm, Infisical operator, ArgoCD, cert-renewal,
KEDA) is one-time and already done — see `homeport-infrastructure-apps/DEPLOYMENT.md`.
This skill covers only adding or releasing **one app**.

## Split of responsibility

| Where | What lives there |
|---|---|
| App repo (`apps/<name>/k8s/chart/`) | Helm chart: `Chart.yaml`, `values.yaml`, `values-prod.yaml`, `values-prod.example.yaml`, `templates/` |
| App repo (`.github/workflows/<name>-build-push.yml`) | Tag-triggered image build, tag bump, ArgoCD sync |
| `homeport-infrastructure-apps/infrastructure/argocd/k8s/applications/<name>.yaml` | ArgoCD `Application` pointing at the chart. The app repo has none. |
| Infisical ("Homeport" project, `prod`) | Real secrets, one folder per app |

Never put an ArgoCD `Application` or cluster config in the app repo.

## Procedure (new app)

Copy-and-adapt, never invent. Reference: `homeport-personal-apps/apps/actual/k8s/chart`
(Deployment + PVC) and `apps/mcp-servers` (Infisical secret). Templates: see
[references/chart-templates.md](references/chart-templates.md).

1. **Chart.** Create `apps/<name>/k8s/chart/` from the templates. Use `{{ .Release.Name }}`
   for names. Add `enableServiceLinks: false` to the pod spec (see Gotchas).
2. **Values.** `values.yaml` = safe defaults, no secrets. `values-prod.yaml` = hostname,
   Infisical `projectId`/`secretPath`. Both are committed (ArgoCD reads them from git).
3. **Secrets.** Add an `InfisicalStaticSecret` template behind `infisical.enabled`. Create
   the app's folder in Infisical `prod` first, with the keys the template expects.
4. **Workflow.** Copy `homeport-personal-apps/.github/workflows/actual-build-push.yml`.
   Trigger: tag `<name>-v*`. It builds, pushes `ghcr.io/lukasbriza/<name>`, seds the tag
   into `values.yaml`, commits to `master`, runs `argocd app sync`.
5. **ArgoCD Application.** Add the file in the infra repo (template in references).
   Leave `automated` sync off until a manual first sync works.
6. **First release.** `git tag <name>-v0.1.0 && git push origin <name>-v0.1.0`.
7. **GHCR package → Public** (first push creates it private; no pull secret exists).
8. **TLS + verify:**
   ```bash
   kubectl create job --from=cronjob/cert-renewal -n cert-renewal cert-renewal-manual
   kubectl get secret <name>-tls -n <namespace>
   curl -v https://<hostname>
   ```

## Releasing an existing app

`git tag <name>-v<version> && git push origin <name>-v<version>`. Nothing else.
Upstream-image apps with no build: bump the tag in `values.yaml` by hand.

## Gotchas

- **Service name = env var prefix.** Service `foo` makes kubelet inject `FOO_PORT=tcp://…`,
  which breaks apps reading `FOO_PORT` as a number. Fix: `enableServiceLinks: false`, not a rename.
- **Hostname conflicts.** Before cutover run `kubectl get ingress -A | grep <hostname>`.
  Delete a matching `legacy-proxy` Ingress. Two Ingresses for one host break TLS and routing.
- **PVC.** Every standalone PVC gets `helm.sh/resource-policy: keep` (local-path reclaim is `Delete`).
- **Data migration.** Files/SQLite: `rsync` into the PV host path. Postgres/MariaDB: dump and restore, never copy the data directory.
- **Scale-to-zero (KEDA).** Opt-in via `scaleToZero.*`. Not for SSE/WebSocket or auth dependencies. Reference: `apps/wishlist`.
- **YAML comments** are technical only. No migration phases, task numbers or process narrative.
- **Commits:** Conventional Commits, e.g. `feat(<name>): add helm chart`.

## Monorepo specifics (differs from personal-apps)

Personal-apps builds with `context: apps/<name>`. A turbo monorepo cannot: the image needs
the repo root. Template Dockerfiles: `docker/node/Dockerfile` (args `APP`, `PORT`, `APP_FOLDER`;
`turbo prune @lukasbriza/${APP}`) and `docker/node/prisma/Dockerfile`. In the workflow use
`context: .`, `file: docker/node/Dockerfile`, `build-args: APP=<name>`. Verify the build
locally before the first tag. Prisma migrations in the cluster (init container vs. job)
are not covered here — decide per app and document it in the app's `CLAUDE.md`.

## Do not

- Create ArgoCD config or cluster-level resources in the app repo.
- Put real credentials in `values*.yaml`.
- Enable `automated` sync before one manual sync succeeded.
- Edit this skill in a scaffolded copy. Edit it in the template, then `sync-template`.
