#FROM node:18.18.0-alpine as frontend
#WORKDIR /app
#COPY frontend/* ./
#RUN yarn && yarn build

FROM golang:1.23 as builder

WORKDIR /go/src


COPY server/main.go server/go.mod server/go.sum ./

RUN go mod tidy

RUN ls -al

RUN CGO_ENABLED=0 GOOS=linux go build -o bin/server -ldflags "-s -w" -trimpath main.go

FROM node:23.1.0-alpine
WORKDIR /app
COPY --from=builder /go/src/bin/server /app/server
COPY plugin/src ./plugin/src
COPY plugin/package.json plugin/yarn.lock ./plugin/
RUN cd plugin && yarn
RUN mkdir -p ./plugin/plugins
COPY server/web ./web/

EXPOSE 18888

ENV API_PORT=18888
ENV API_BASE_URL=""
ENTRYPOINT ["/app/server"]
