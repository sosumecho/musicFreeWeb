.PHONY: web
web:
	cd frontend && yarn && yarn build
	ls server/web | grep -v web.go | awk '{print $1}' | xargs rm -rf
	cp -r frontend/build/* server/web

.PHONY: build
build:
	cd server && go build -o bin/server -ldflags "-s -w" -trimpath main.go