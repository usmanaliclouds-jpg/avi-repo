# Platform Technology Comparisons & Evaluation

This document provides a written architectural evaluation comparing the primary platform tools deployed in this cluster against their key alternatives.

---

## 1. GitOps Engine: ArgoCD vs. FluxCD

| Metric / Feature | ArgoCD (Primary Deployed) | FluxCD (Isolated Comparison) |
|---|---|---|
| **Architecture** | Web UI + Centralized Controller (`argocd-server`) | Controller-per-CRD (Source Controller, Kustomize Controller, Helm Controller) |
| **User Experience (UX)** | Rich Web UI dashboard with real-time status tree, diff visualization, and manual sync buttons | CLI-first (`flux` CLI), developer git-push workflow without mandatory UI |
| **Sync Model** | Continuous polling & webhook support with declarative Application CRDs | GitRepository / Kustomization reconciliation loops |
| **Setup Complexity** | Single deployment manifest or Helm chart; intuitive UI | Modular controllers; lighter footprint |
| **Resource Usage** | ~256Mi - 512Mi RAM | ~128Mi RAM total across controllers |
| **Evaluation Summary** | ArgoCD was chosen as the primary engine for its superior visual observability and state inspection on local single-node clusters. FluxCD was evaluated in an isolated namespace (`gitops`) with a lightweight demo app (`apps/flux-demo`) to compare CLI reconciliation speed. |

---

## 2. Storage Layer: Longhorn vs. OpenEBS

| Metric / Feature | Longhorn (Primary Deployed) | OpenEBS (Written Evaluation) |
|---|---|---|
| **Storage Model** | Distributed block storage with CSI driver, volume replication, and snapshot management | Cloud-native block storage supporting LocalPV (hostpath/ZFS) and Mayastor engines |
| **Memory Footprint** | ~64Mi - 128Mi RAM (single node mode) | ~128Mi - 256Mi RAM depending on engine |
| **Ease of Operation** | Includes built-in Web UI for volume management, simple installation via manifest/chart | Highly modular (cStor, Jiva, LocalPV), requires engine choice upfront |
| **Local Node Sizing** | Lightweight when run single-replica on local k3s | LocalPV mode is ultra-fast, but Mayastor requires hugepages and kernel modules |
| **Evaluation Summary** | Longhorn provides simple CSI provisioning out of the box with zero external kernel prerequisites, making it ideal for 8GB RAM laptops. OpenEBS LocalPV offers lower latency, but Longhorn wins on ease of backup/snapshot management. |

---

## 3. Ingress Controller: Traefik vs. NGINX Ingress

| Metric / Feature | Traefik (Primary Deployed) | NGINX Ingress Controller |
|---|---|---|
| **Deployment Mode** | Built-in native ingress controller shipped default with k3s | Separate deployment required (`ingress-nginx` Helm chart) |
| **RAM Footprint** | ~30Mi - 60Mi RAM (included in k3s base) | ~100Mi - 150Mi extra RAM |
| **Dynamic Reloading** | Hot-reloads configuration changes without breaking existing connections | Requires reload of NGINX process on config updates |
| **Features** | Middleware CRDs, automatic TLS certificates, Dashboard | Rich annotation system, lua scripting, widespread legacy usage |
| **Evaluation Summary** | Traefik was retained as the primary ingress controller because it ships natively with k3s, saving ~100MB RAM and avoiding unnecessary external controller overhead on an 8GB laptop. |
