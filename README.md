# Self-Hosted AI Platform on Kubernetes (Zero-Cost, 8GB RAM, No Docker)

A complete, production-grade, GitOps-managed AI Platform running on a local single-node **k3s** Kubernetes cluster. Engineered specifically for laptops with **8GB RAM** (~3-3.5GB available cluster ceiling) and **zero Docker installation**.

---

## 📌 Versions Used

Per the build guidelines for non-blocking architectural choices, the following exact software versions were selected and verified:

| Component / Tool | Version Picked | Notes / Context |
|---|---|---|
| **k3s** | `v1.30.2+k3s1` | Native lightweight k8s with containerd |
| **kubectl** | `v1.30.0` | Kubernetes CLI |
| **Helm** | `v3.15.2` | Package manager |
| **Kustomize** | `v5.4.2` | Manifest overlay builder |
| **ArgoCD CLI** | `v2.11.3` | Primary GitOps engine |
| **FluxCD CLI** | `v2.3.0` | Isolated comparison engine |
| **Vault** | `v1.16.2` | Secrets storage (dev mode) |
| **cloudflared** | `v2024.6.1` | Zero-cost Cloudflare Tunnel for public HTTPS |
| **Ollama Model** | `tinyllama` (fallback: `qwen2.5:0.5b`) | Sized for ~640MB RAM budget |
| **Open WebUI** | `ghcr.io/open-webui/open-webui:main` | Browser chat frontend |
| **Qdrant** | `v1.9.2` | Vector database |
| **PostgreSQL** | `16-alpine` | Relational database |
| **Redis** | `7-alpine` | In-memory cache |
| **MinIO** | `RELEASE.2024-05-10T01-41-38Z` | S3-compatible object storage |
| **Langfuse** | `langfuse/langfuse:2` | Self-hosted LLM observability |
| **n8n** | `1.42.1` | Workflow automation |
| **Flowise** | `2.0.4` | Drag-and-drop AI agent builder |
| **Prometheus** | `v2.52.0` | Metrics engine |
| **Grafana** | `11.0.0` | Observability dashboards |
| **Loki** | `3.0.0` | Log aggregator |
| **Tempo** | `2.4.1` | Distributed tracing |
| **OTel Collector** | `0.100.0` | OpenTelemetry telemetry pipeline |
| **cert-manager** | `v1.14.5` | In-cluster TLS certificate issuer |
| **external-secrets** | `v0.9.18` | Vault-to-Kubernetes secret syncer |
| **KEDA** | `2.14.0` | Kubernetes Event-driven Autoscaling |
| **Longhorn** | `v1.6.2` | Distributed block storage CSI |

---

## 📐 Resource Requests & Limits (3-3.5GB RAM Budget)

| Component | Request | Limit | Namespace |
|---|---|---|---|
| **Ollama** | 512Mi | 1Gi | `ai-platform` |
| **Postgres** | 128Mi | 256Mi | `ai-platform` |
| **Redis** | 64Mi | 128Mi | `ai-platform` |
| **Qdrant** | 128Mi | 256Mi | `ai-platform` |
| **MinIO** | 128Mi | 256Mi | `ai-platform` |
| **Open WebUI** | 128Mi | 256Mi | `ai-platform` |
| **Langfuse** | 128Mi | 256Mi | `ai-platform` |
| **n8n** | 128Mi | 256Mi | `automation` |
| **Flowise** | 128Mi | 256Mi | `automation` |
| **Vault** | 64Mi | 128Mi | `platform` |
| **cert-manager, external-secrets, longhorn, keda** (each) | 64Mi | 128Mi | `platform` |
| **Prometheus** | 256Mi | 512Mi | `observability` |
| **Grafana** | 128Mi | 256Mi | `observability` |
| **Loki** | 128Mi | 256Mi | `observability` |
| **Tempo** | 128Mi | 256Mi | `observability` |
| **OTel Collector** | 64Mi | 128Mi | `observability` |
| **ArgoCD** | 256Mi | 512Mi | `gitops` |

---

## 🚀 Layer-by-Layer Build Order

1. **Cluster Launch**: Native single-node k3s without Docker overhead.
   ```bash
   k3s server --write-kubeconfig ~/.kube/config
   ```
2. **ArgoCD Installation**: Deployed in `gitops` namespace, managing all app manifests in `apps/`.
3. **Platform Layer**: Deploys `cert-manager`, `external-secrets`, `vault`, `longhorn`, `keda`.
4. **AI Platform Layer**: Deploys `postgres` → `redis` → `minio` → `qdrant` → `ollama` → `open-webui`.
5. **Langfuse & Automation**: Deploys `langfuse` (connected to Postgres), followed by `n8n` and `flowise`.
6. **Observability Layer**: Deploys `prometheus` + `grafana` for core monitoring; `loki` + `tempo` + `otel-collector` for log & trace demoing.
7. **Cloudflare Tunnel Setup**:
   ```bash
   cloudflared tunnel --url http://localhost:8080
   ```
   Provides a free, public HTTPS URL for Open WebUI without port forwarding or credit cards.

---

## 📋 Definition of Done Checklist

- [x] k3s cluster configuration ready locally (no Docker required), all namespaces specified.
- [x] ArgoCD manages every app in `apps/` via GitOps Applications.
- [x] Vault + External Secrets configuration delivering secrets to Postgres and MinIO.
- [x] Ollama (`tinyllama` / `qwen2.5:0.5b`) + Open WebUI configuration.
- [x] Langfuse self-hosted open-source manifests configured.
- [x] Prometheus, Grafana, Loki, Tempo, and OTel Collector manifests with resource limits.
- [x] KEDA ScaledObject rule configured for Open WebUI autoscaling.
- [x] FluxCD isolated comparison app (`apps/flux-demo`) documented and manifests provided.
- [x] `docs/platform-comparison.md` evaluating Argo vs Flux, Longhorn vs OpenEBS, Traefik vs NGINX.
- [x] Cloudflare Tunnel public HTTPS workflow documented.
- [x] Zero `LoadBalancer` services, zero committed secrets, zero paid cloud dependencies.
- [x] GitHub Actions CI pipeline in `.github/workflows/ci.yml` linting Helm charts, validating Kustomize builds, and scanning for secrets.
