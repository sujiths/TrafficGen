from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

class TGHTTPHandler(BaseHTTPRequestHandler):

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        self.wfile.write("<html><body><h1>hi!</h1></body></html>")

    def do_HEAD(self):
        self._set_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "*")

    def do_POST(self):
        # Doesn't do anything with posted data
        content_len = int(self.headers.getheader('content-length', 0))
        post_body = self.rfile.read(content_len)
        print post_body
        self._set_headers()
    	self.wfile.write("<html><body><h1>OK!</h1></body></html>")
        self.server.queue.put(post_body)

class TGBaseHTTPServer(HTTPServer):
    def __init__(self, server_address, handler_class, queue):
        HTTPServer.__init__(self, server_address, handler_class, True)
        self.queue = queue




class TGHTTPServer(object):
    def __init__(self):
        pass

    def run(self, port, queue):
        server_address = ('', port)
        handler_class = TGHTTPHandler
        httpd = TGBaseHTTPServer(server_address, handler_class, queue)
        print 'Starting httpd...'
        while True:
            httpd.handle_request()

        httpd.serve_forever()
