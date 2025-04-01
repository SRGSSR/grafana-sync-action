FROM alpine:latest

RUN apk add --no-cache ca-certificates git curl jq

COPY export_dashboards.sh /usr/local/bin/export_dashboards.sh
RUN chmod +x /usr/local/bin/export_dashboards.sh

ENTRYPOINT ["/usr/local/bin/export_dashboards.sh"]
