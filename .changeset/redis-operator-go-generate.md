---
"@kubernetes-models/redis-operator": major
---

Migrate from crd-generate to go-generate. Drops the v0.13.0 versions of `Redis`/`RedisCluster` that the previous crd-generate config pinned (Go API source for that version is older and structurally different); the package now follows the v0.24.0 v1beta2 API. The cross-package `RedisFollower` collision (between `api/common/v1beta2` and `api/rediscluster/v1beta2`) is resolved by the case-collision pass.
