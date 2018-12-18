KUBERNETES_VERSION = 1.13.1
OPENAPI_GENERATOR_CLI = openapitools/openapi-generator-cli:v3.3.4

swagger_path = gen/swagger-$(KUBERNETES_VERSION).json

gen: gen/openapi gen/ts

$(swagger_path):
	mkdir -p $(dir $@)
	curl -L https://raw.githubusercontent.com/kubernetes/kubernetes/v$(KUBERNETES_VERSION)/api/openapi-spec/swagger.json > $@

gen/openapi: $(swagger_path)
	docker run --rm -v $(CURDIR):/local $(OPENAPI_GENERATOR_CLI) generate \
		-i /local/$(swagger_path) \
		-g typescript-node \
		--skip-validate-spec \
		-o /local/$@
	rm -rf $@/api.ts $@/git_push.sh $@/api $@/model/models.ts

gen/ts: gen/openapi $(swagger_path)
	npm run generate -- \
		--file $(swagger_path) \
		--model gen/openapi/model \
		--output $@

.PHONY: clean
clean:
	rm -rf gen dist
