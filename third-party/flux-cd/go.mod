module github.com/tommy351/kubernetes-models-ts/third-party/flux-cd

go 1.26.2

tool (
	github.com/fluxcd/helm-controller/api/v2
	github.com/fluxcd/helm-controller/api/v2beta1
	github.com/fluxcd/helm-controller/api/v2beta2
	github.com/fluxcd/image-automation-controller/api/v1
	github.com/fluxcd/image-automation-controller/api/v1beta1
	github.com/fluxcd/image-automation-controller/api/v1beta2
	github.com/fluxcd/image-reflector-controller/api/v1
	github.com/fluxcd/image-reflector-controller/api/v1beta1
	github.com/fluxcd/image-reflector-controller/api/v1beta2
	github.com/fluxcd/kustomize-controller/api/v1
	github.com/fluxcd/kustomize-controller/api/v1beta1
	github.com/fluxcd/kustomize-controller/api/v1beta2
	github.com/fluxcd/notification-controller/api/v1
	github.com/fluxcd/notification-controller/api/v1beta1
	github.com/fluxcd/notification-controller/api/v1beta2
	github.com/fluxcd/notification-controller/api/v1beta3
	github.com/fluxcd/source-controller/api/v1
	github.com/fluxcd/source-controller/api/v1beta1
	github.com/fluxcd/source-controller/api/v1beta2
)

require (
	github.com/fluxcd/helm-controller/api v1.5.4 // indirect
	github.com/fluxcd/image-automation-controller/api v1.1.3 // indirect
	github.com/fluxcd/image-reflector-controller/api v1.1.1 // indirect
	github.com/fluxcd/kustomize-controller/api v1.8.5 // indirect
	github.com/fluxcd/notification-controller/api v1.8.4 // indirect
	github.com/fluxcd/pkg/apis/acl v0.9.0 // indirect
	github.com/fluxcd/pkg/apis/kustomize v1.15.1 // indirect
	github.com/fluxcd/pkg/apis/meta v1.25.1 // indirect
	github.com/fluxcd/source-controller/api v1.8.4 // indirect
	github.com/fxamacker/cbor/v2 v2.9.0 // indirect
	github.com/go-logr/logr v1.4.3 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.3-0.20250322232337-35a7c28c31ee // indirect
	github.com/x448/float16 v0.8.4 // indirect
	go.yaml.in/yaml/v2 v2.4.3 // indirect
	golang.org/x/net v0.53.0 // indirect
	golang.org/x/text v0.36.0 // indirect
	gopkg.in/inf.v0 v0.9.1 // indirect
	k8s.io/apiextensions-apiserver v0.35.2 // indirect
	k8s.io/apimachinery v0.35.2 // indirect
	k8s.io/klog/v2 v2.130.1 // indirect
	k8s.io/kube-openapi v0.0.0-20250910181357-589584f1c912 // indirect
	k8s.io/utils v0.0.0-20251002143259-bc988d571ff4 // indirect
	sigs.k8s.io/controller-runtime v0.23.1 // indirect
	sigs.k8s.io/json v0.0.0-20250730193827-2d320260d730 // indirect
	sigs.k8s.io/randfill v1.0.0 // indirect
	sigs.k8s.io/structured-merge-diff/v6 v6.3.2-0.20260122202528-d9cc6641c482 // indirect
	sigs.k8s.io/yaml v1.6.0 // indirect
)
