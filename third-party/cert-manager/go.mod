module github.com/tommy351/kubernetes-models-ts/third-party/cert-manager

go 1.26.1

tool (
	github.com/cert-manager/approver-policy/pkg/apis/policy/v1alpha1
	github.com/cert-manager/aws-privateca-issuer/pkg/api/v1beta1
	github.com/cert-manager/cert-manager/pkg/apis/acme/v1
	github.com/cert-manager/cert-manager/pkg/apis/certmanager/v1
	github.com/cert-manager/trust-manager/pkg/apis/trust/v1alpha1
	github.com/cert-manager/trust-manager/pkg/apis/trustmanager/v1alpha2
)

require (
	github.com/cert-manager/approver-policy v0.25.1 // indirect
	github.com/cert-manager/aws-privateca-issuer v1.8.1 // indirect
	github.com/cert-manager/cert-manager v1.20.2 // indirect
	github.com/cert-manager/trust-manager v0.22.1 // indirect
	github.com/fxamacker/cbor/v2 v2.9.0 // indirect
	github.com/go-logr/logr v1.4.3 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/kr/text v0.2.0 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.3-0.20250322232337-35a7c28c31ee // indirect
	github.com/x448/float16 v0.8.4 // indirect
	go.yaml.in/yaml/v2 v2.4.3 // indirect
	golang.org/x/net v0.53.0 // indirect
	golang.org/x/text v0.36.0 // indirect
	gopkg.in/inf.v0 v0.9.1 // indirect
	k8s.io/api v0.36.0 // indirect
	k8s.io/apiextensions-apiserver v0.36.0 // indirect
	k8s.io/apimachinery v0.36.0 // indirect
	k8s.io/client-go v0.36.0 // indirect
	k8s.io/klog/v2 v2.140.0 // indirect
	k8s.io/kube-openapi v0.0.0-20260317180543-43fb72c5454a // indirect
	k8s.io/utils v0.0.0-20260319190234-28399d86e0b5 // indirect
	sigs.k8s.io/controller-runtime v0.24.0 // indirect
	sigs.k8s.io/gateway-api v1.5.0 // indirect
	sigs.k8s.io/json v0.0.0-20250730193827-2d320260d730 // indirect
	sigs.k8s.io/randfill v1.0.0 // indirect
	sigs.k8s.io/structured-merge-diff/v6 v6.4.0 // indirect
	sigs.k8s.io/yaml v1.6.0 // indirect
)
