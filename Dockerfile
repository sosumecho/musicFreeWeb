FROM --platform=$BUILDPLATFORM golang:1.23 as builder

WORKDIR /go/src

COPY server/go.mod server/go.sum ./

RUN go mod download

COPY server/ .

ARG TARGETOS
ARG TARGETARCH

RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o bin/server -ldflags "-s -w" -trimpath main.go


FROM node:23.1.0-alpine as frontend
WORKDIR /app
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn
COPY frontend/ .
RUN yarn build



FROM node:23.1.0-alpine as plugin
WORKDIR /app

COPY plugin/package.json plugin/yarn.lock ./
RUN  yarn
COPY plugin/ .
RUN yarn build

FROM node:23.1.0-alpine
WORKDIR /app
COPY --from=builder /go/src/bin/server ./server
COPY --from=frontend /app/build ./web
COPY --from=plugin /app/dist ./plugin/dist
COPY --from=plugin /app/plugins ./plugin/plugins

EXPOSE 18888

ENV API_PORT=18888
ENV API_BASE_URL=""
ENTRYPOINT ["/app/server"]
