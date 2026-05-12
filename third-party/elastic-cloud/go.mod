module github.com/tommy351/kubernetes-models-ts/third-party/elastic-cloud

go 1.26.1

replace (
	k8s.io/api => k8s.io/api v0.34.3
	k8s.io/apimachinery => k8s.io/apimachinery v0.34.3
	k8s.io/client-go => k8s.io/client-go v0.34.3
)

tool (
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/agent/v1alpha1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/apm/v1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/apm/v1beta1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/autoops/v1alpha1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/autoscaling/v1alpha1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/beat/v1beta1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/elasticsearch/v1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/elasticsearch/v1beta1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/enterprisesearch/v1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/enterprisesearch/v1beta1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/kibana/v1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/kibana/v1beta1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/logstash/v1alpha1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/maps/v1alpha1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/packageregistry/v1alpha1
	github.com/elastic/cloud-on-k8s/v3/pkg/apis/stackconfigpolicy/v1alpha1
)

require (
	github.com/armon/go-radix v1.0.0 // indirect
	github.com/blang/semver/v4 v4.0.0 // indirect
	github.com/davecgh/go-spew v1.1.2-0.20180830191138-d8f796af33cc // indirect
	github.com/elastic/cloud-on-k8s/v3 v3.3.2 // indirect
	github.com/elastic/go-sysinfo v1.15.2 // indirect
	github.com/elastic/go-ucfg v0.8.9-0.20251017163010-3520930bed4f // indirect
	github.com/elastic/go-windows v1.0.2 // indirect
	github.com/emicklei/go-restful/v3 v3.12.2 // indirect
	github.com/evanphx/json-patch/v5 v5.9.11 // indirect
	github.com/fxamacker/cbor/v2 v2.9.0 // indirect
	github.com/go-logr/logr v1.4.3 // indirect
	github.com/go-logr/zapr v1.3.0 // indirect
	github.com/go-openapi/jsonpointer v0.21.0 // indirect
	github.com/go-openapi/jsonreference v0.21.0 // indirect
	github.com/go-openapi/swag v0.23.0 // indirect
	github.com/gogo/protobuf v1.3.2 // indirect
	github.com/google/gnostic-models v0.7.0 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/hashicorp/errwrap v1.1.0 // indirect
	github.com/hashicorp/go-multierror v1.1.1 // indirect
	github.com/josharian/intern v1.0.0 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/mailru/easyjson v0.7.7 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.3-0.20250322232337-35a7c28c31ee // indirect
	github.com/munnerz/goautoneg v0.0.0-20191010083416-a7dc8b61c822 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/prometheus/procfs v0.16.1 // indirect
	github.com/spf13/pflag v1.0.10 // indirect
	github.com/x448/float16 v0.8.4 // indirect
	go.elastic.co/apm/module/apmzap/v2 v2.7.2 // indirect
	go.elastic.co/apm/v2 v2.7.2 // indirect
	go.elastic.co/fastjson v1.5.1 // indirect
	go.uber.org/multierr v1.11.0 // indirect
	go.uber.org/zap v1.27.1 // indirect
	go.yaml.in/yaml/v2 v2.4.3 // indirect
	go.yaml.in/yaml/v3 v3.0.4 // indirect
	golang.org/x/net v0.48.0 // indirect
	golang.org/x/oauth2 v0.34.0 // indirect
	golang.org/x/sys v0.39.0 // indirect
	golang.org/x/term v0.38.0 // indirect
	golang.org/x/text v0.32.0 // indirect
	golang.org/x/time v0.12.0 // indirect
	google.golang.org/protobuf v1.36.11 // indirect
	gopkg.in/evanphx/json-patch.v4 v4.13.0 // indirect
	gopkg.in/inf.v0 v0.9.1 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
	howett.net/plist v1.0.1 // indirect
	k8s.io/api v0.35.0 // indirect
	k8s.io/apimachinery v0.35.0 // indirect
	k8s.io/client-go v0.35.0 // indirect
	k8s.io/klog/v2 v2.130.1 // indirect
	k8s.io/kube-openapi v0.0.0-20250910181357-589584f1c912 // indirect
	k8s.io/utils v0.0.0-20251002143259-bc988d571ff4 // indirect
	sigs.k8s.io/controller-runtime v0.22.4 // indirect
	sigs.k8s.io/json v0.0.0-20250730193827-2d320260d730 // indirect
	sigs.k8s.io/randfill v1.0.0 // indirect
	sigs.k8s.io/structured-merge-diff/v6 v6.3.0 // indirect
	sigs.k8s.io/yaml v1.6.0 // indirect
)
