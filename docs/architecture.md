# Self-Hosted AI Platform Architecture

## Architecture Overview

This platform is a zero-cost, GitOps-managed self-hosted AI platform designed to run on a local Kubernetes cluster (k3s) on an 8GB RAM Linux machine without Docker.

```mermaid
graph TD
    Client[Browser / Client] --> Cloudflare[Cloudflare Tunnel]
    Cloudflare --> Traefik[Traefik Ingress Controller]
    
    subgraph GitOps Namespace
        ArgoCD[ArgoCD Controller]
        Flux[FluxCD Isolated Demo]
    end

    subgraph Platform Namespace
        CertManager[cert-manager]
        ESO[External Secrets Operator]
        Vault[HashiCorp Vault Dev Mode]
        Longhorn[Longhorn Storage]
        KEDA[KEDA Autoscaler]
    end

    subgraph AI Platform Namespace
        Traefik --> OpenWebUI[Open WebUI]
        OpenWebUI --> Ollama[Ollama TinyLlama / Qwen2.5]
        OpenWebUI --> Qdrant[Qdrant Vector DB]
        OpenWebUI --> Postgres[PostgreSQL 16]
        OpenWebUI --> MinIO[MinIO Object Store]
        OpenWebUI --> Redis[Redis Cache]
        Langfuse[Langfuse Self-Hosted] --> Postgres
    end

    subgraph Automation Namespace
        n8n[n8n Automation]
        Flowise[Flowise AI Builder]
    end

    subgraph Observability Namespace
        Prometheus[Prometheus Metrics]
        Grafana[Grafana Dashboards]
        Loki[Loki Log Aggregator]
        Tempo[Tempo Tracing]
        OTel[OTel Collector]
    end

    ESO -->|Reads Secrets| Vault
    ESO -->|Injects Secrets| Postgres
    ESO -->|Injects Secrets| MinIO
```

## Namespace Layout & RAM Allocation

| Namespace | Components | Memory Request | Memory Limit |
|---|---|---|---|
| `platform` | cert-manager, external-secrets, vault, longhorn, keda | 320Mi | 640Mi |
| `gitops` | argocd | 256Mi | 512Mi |
| `observability` | prometheus, grafana, loki, tempo, otel-collector | 704Mi | 1.4Gi |
| `ai-platform` | ollama, open-webui, qdrant, redis, postgres, minio, langfuse | 1.25Gi | 2.5Gi |
| `automation` | n8n, flowise | 256Mi | 512Mi |

## Key Design Principles
1. **Containerd Native**: Runs directly on k3s containerd runtime without Docker dependencies.
2. **Strict Memory Limits**: Hard memory ceilings per container ensure cluster fits within 3-3.5GB RAM.
3. **No LoadBalancers**: Uses `ClusterIP` + Ingress only to guarantee $0 cost.
4. **GitOps Single Source of Truth**: All manifests version controlled and managed via ArgoCD.
