// Package ext is a local stand-in for github.com/traefik/traefik/dynamic/ext,
// which upstream traefik exposes only via an in-repo `replace` directive
// pointing at pkg/config/dynamic/ext. We mirror that replace here so the
// generator can compile the v3 dynamic config types.
package ext

// HTTP is a dynamic.HTTP extension.
type HTTP struct{}

// Router is a dynamic.Router extension.
type Router struct{}
