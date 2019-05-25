KUBERNETES_VERSION = 1.14.2

swagger_path = gen/swagger-$(KUBERNETES_VERSION).json

$(swagger_path):
	mkdir -p $(dir $@)
	curl -L https://raw.githubusercontent.com/kubernetes/kubernetes/v$(KUBERNETES_VERSION)/api/openapi-spec/swagger.json > $@

gen/ts: $(swagger_path)
	npm run generate -- --file $(swagger_path) --output $@

dist: gen/ts
	npm run build
	cp LICENSE $@
	cp package.json $@
	cp README.md $@

.PHONY: clean
clean:
	rm -rf gen dist
