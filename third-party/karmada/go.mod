module github.com/tommy351/kubernetes-models-ts/third-party/karmada

go 1.26.2

tool (
	github.com/karmada-io/karmada/pkg/apis/apps/v1alpha1
	github.com/karmada-io/karmada/pkg/apis/autoscaling/v1alpha1
	github.com/karmada-io/karmada/pkg/apis/cluster/v1alpha1
	github.com/karmada-io/karmada/pkg/apis/config/v1alpha1
	github.com/karmada-io/karmada/pkg/apis/networking/v1alpha1
	github.com/karmada-io/karmada/pkg/apis/policy/v1alpha1
	github.com/karmada-io/karmada/pkg/apis/remedy/v1alpha1
	github.com/karmada-io/karmada/pkg/apis/search/v1alpha1
	github.com/karmada-io/karmada/pkg/apis/work/v1alpha1
	github.com/karmada-io/karmada/pkg/apis/work/v1alpha2
)

require (
	github.com/fxamacker/cbor/v2 v2.9.0 // indirect
	github.com/go-logr/logr v1.4.3 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/karmada-io/karmada v1.17.2 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.3-0.20250322232337-35a7c28c31ee // indirect
	github.com/x448/float16 v0.8.4 // indirect
	go.yaml.in/yaml/v2 v2.4.3 // indirect
	golang.org/x/net v0.49.0 // indirect
	golang.org/x/text v0.33.0 // indirect
	gopkg.in/inf.v0 v0.9.1 // indirect
	k8s.io/api v0.35.0 // indirect
	k8s.io/apiextensions-apiserver v0.35.0 // indirect
	k8s.io/apimachinery v0.35.0 // indirect
	k8s.io/klog/v2 v2.130.1 // indirect
	k8s.io/kube-openapi v0.0.0-20260304202019-5b3e3fdb0acf // indirect
	k8s.io/utils v0.0.0-20260108192941-914a6e750570 // indirect
	sigs.k8s.io/controller-runtime v0.23.1 // indirect
	sigs.k8s.io/json v0.0.0-20250730193827-2d320260d730 // indirect
	sigs.k8s.io/randfill v1.0.0 // indirect
	sigs.k8s.io/structured-merge-diff/v6 v6.3.2-0.20260122202528-d9cc6641c482 // indirect
)
