---
"@kubernetes-models/go-generate": patch
---

Qualify same-package refs in inlined struct schemas. Field refs to siblings of an inlined struct (e.g. `corev1.VolumeSource.awsElasticBlockStore → AWSElasticBlockStoreVolumeSource`) arrive from the controller-tools parser in unqualified form. Run `refPackageAdder` on the inlined schema with the source type's package as the fallback so `refNormalizer` can produce a proper `io.k8s.api.core.v1.*` ref instead of an empty-package one.
