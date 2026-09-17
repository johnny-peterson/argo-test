# Deploy: Capoeira Moves API

Helm chart + Argo CD Application for local testing and deployment.

## Layout

```
deploy/
├── Dockerfile              # Build the Node.js API image
├── README.md
├── argocd/
│   └── application.yaml     # Argo CD Application pointing at the chart
└── charts/
    └── capoeira-api/        # The Helm chart
```

## 1. Build the image

The chart uses a placeholder image (`capoeira-api:0.1.0`). Build it once the API
source exists (see the `capoeira-moves-api` spec):

```sh
docker build -f deploy/Dockerfile -t capoeira-api:0.1.0 .
```

For a local kind/minikube cluster, load the image so nodes can pull it:

```sh
# kind
kind load docker-image capoeira-api:0.1.0
# minikube
minikube image load capoeira-api:0.1.0
```

## 2. Test the chart directly with Helm (no Argo CD)

```sh
helm lint deploy/charts/capoeira-api
helm template deploy/charts/capoeira-api        # render manifests
helm install capoeira-api deploy/charts/capoeira-api --namespace capoeira --create-namespace
```

Port-forward and hit the API:

```sh
kubectl -n capoeira port-forward svc/capoeira-api 8080:80
curl "http://localhost:8080/counter?move=Armada"
```

## 3. Deploy via Argo CD

Assumes Argo CD is already installed in the `argocd` namespace and this repo is
pushed to the `repoURL` in `argocd/application.yaml`.

```sh
kubectl apply -f deploy/argocd/application.yaml
argocd app sync capoeira-api      # or let automated sync pick it up
```

## Notes

- Update `image.repository`/`tag` in `values.yaml` (or the Application's inline
  values) once you push the image to a registry Argo CD's cluster can reach.
- Probes hit `/` for a basic liveness/readiness signal. Point them at a dedicated
  health route if you add one.
- Update `repoURL` and `targetRevision` in the Application to match your remote.
