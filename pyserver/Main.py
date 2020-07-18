from multiprocessing import Process,Queue
from TGHTTPServer import TGHTTPServer
import time
import json
import socket
import sys
import signal
from time import sleep


def signalhandler(signum, frame):
    print "Received TERM signal"
    exit()
 

def main():
    signal.signal(signal.SIGTERM, signalhandler)

    # read config input
    cmdQueue = Queue(10)

    print "Starting server"
    http_server = TGHTTPServer()

    server_process = Process(target=http_server.run, args=(9000, cmdQueue))
    server_process.daemon = True
    server_process.start()
    gen_process = None

    while(True):
        message_str = cmdQueue.get()
	message = json.loads(message_str)
	if(message['command'] == 1):
	    gen_process = Process(target=trafficGen, args=(cmdQueue, int(message['count']), int(message['delay']), message['ip'], int(message['port']), message['proto_tcp']))
            gen_process.daemon = True
            gen_process.start()
        else:
	    print "Stopped"
	    gen_process.terminate()
	    gen_process.join()

        print "Recieved message", message['command']


def trafficGen(queue, count, delay, url, port, proto):
    i = 0
    print "Started ", url, port, proto
    while(i < count):
	if(proto):
	    print "PROTO_TCP"
	    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	else:
	    print "PROTO_UDP"
	    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	ip = socket.gethostbyname(url)
	sock.connect((ip, port)) 	    
        sock.send("Hello")
        sock.close()
        i+=1
        sleep(delay / 1000)
        print "Connected to ", ip, port
    queue.put("{\"command\":2}")


if __name__ == "__main__":
    main()
