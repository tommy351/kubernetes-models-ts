package main

import (
	golog "log"
	"os"
)

var log = golog.New(os.Stderr, "", 0)
