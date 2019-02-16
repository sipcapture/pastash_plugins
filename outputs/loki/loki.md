Loki output plugin
---

Status : experimental plugin, unit tested and maintained.

This plugin is used to send logs to Loki.

## Requirements 
* Grafana + Loki (or cLoki)


Config using logstash format:
````
input {
  file {
    path => "/var/log/nginx/access.log"
  }
}

output {
  loki {
    host => loki.url
    port => 3100
    path => "/api/prom/push"
  }
}
````

Parameters:

* ``host``: ip of the target HTTP server. Accepts string (single) or Array (multi-target).
* ``port``: port of the target HTTP server. Same for all ips if Array.
* ``path``: path to use in the HTTP request. Can reference log line properties (see [interpolation](../interpolation.md)).
* ``serializer``: more doc at [serializers](serializers.md). Default value to ``raw``.
* ``format``: params used by the ``raw`` [serializer](serializers.md).
* ``ssl``: enable SSL mode. More doc at [ssl](../ssl.md). Default : false
* ``proxy``: use http proxy. More doc at [http proxy](http_proxy.md). Default : none.
* ``basic_auth_user`` and ``basic_auth_password``: user and password for HTTP Basic Auth required by server. Default: none.
* ``maxAge``: maximum bulk cache age in milliseconds. Default 1000.
* ``maxSize``: maximum bulk entries before flush. Default 5000.
