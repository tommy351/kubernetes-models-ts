---
"@kubernetes-models/envoy-gateway": major
---

feat(envoy-gateway): upgrade CRDs to v1.7.2

Breaking changes from upstream Envoy Gateway:

- `targetRef.namespace` has been removed; a policy and its target must reside in the same namespace. To target resources across namespaces, use `targetRefs` together with a `ReferenceGrant`.
- `targetRef` is deprecated in favour of `targetRefs` (array form).

Adds new v1alpha1 resources: `Backend`, `EnvoyExtensionPolicy`, `HTTPRouteFilter`, `RateLimitFilter`.
