# HTTP Streaming

Streams given URL contents to stdout and uses [HTTP range requests][RR] to
fetch additional content when it is available every couple of seconds.

[RR]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests

Useful for dynamically appended logs (build logs, event collectors, etc.)

To start streaming a file use this command:

    npx http-streaming https://example.com
