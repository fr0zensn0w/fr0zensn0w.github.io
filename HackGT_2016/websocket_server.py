import time
import random
import json
import datetime
import tornado
from tornado import websocket, web, ioloop
from tornado.options import define, options, parse_command_line
from datetime import timedelta
from random import randint
import logging
import multiprocessing

from SerialListener import UsbReader


logging.basicConfig()
logger = logging.getLogger('WEB_SOCKET_SERVER')
logger.setLevel(logging.INFO)


define("port", default=8888, help="run on the given port", type=int)


# Create a queue to hold serial messages.
output_queue = multiprocessing.Queue()
# Maintain a list of clients connected to the websocket.
ws_clients = []


class IndexHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        self.render("index.html.bak")


class WebSocketHandler(websocket.WebSocketHandler):

    def check_origin(self, origin):
        """I don't know what this does, but, when you remove it, everything breaks."""
        return True

    # Routine executed upon opening socket.
    def open(self):
        logger.info('Connection established.')
        # self.write_message('Connection established message')
        # IOLoop to wait for 3 seconds before starting to send data.
        ioloop.IOLoop.instance().add_timeout(datetime.timedelta(seconds=3),
                                             self.send_data)
        if self not in ws_clients:
            ws_clients.append(self)

    # Close connection.
    def on_close(self):
        logger.info('Connection closed.')
        if self in ws_clients:
            ws_clients.remove(self)

    def on_message(self, message):        
        """
        when we receive some message we want some message handler..
        for this example i will just print message to console
        """
        logger.info("Received a message : {}".format(message))

    # Our function to send new (random) data for charts.
    def send_data(self, data=None):
        """Function to send data over websocket

        :param data: Python dictionary with data.
        """
        if data:
            # Write JSON data to websocket
            self.write_message(json.dumps(data))

        #create new ioloop instance to intermittently publish data
        ioloop.IOLoop.instance().add_timeout(datetime.timedelta(seconds=1), self.send_data)

## check the queue for pending messages, and rely that to all connected clients
def checkQueue():
    if not output_queue.empty():
        message = output_queue.get()
        for c in ws_clients:
            logger.info('Writing Message')
            c.send_data([message])

if __name__ == "__main__":
    # Create a global USBReader object for all web sockets.
    print('Opening usb')
    reader = UsbReader(message_queue=output_queue)
    reader.start()
    print('Reading usb')
    #create new web app w/ websocket endpoint available at /websocket
    logger.info("Starting websocket server program. Awaiting client requests to open websocket ...")
    application = web.Application([(r'/websocket', WebSocketHandler),
                                   (r'IndexHandler', IndexHandler)])
    # application.handlers
    application.listen(8080)
    mainLoop = tornado.ioloop.IOLoop.instance()
    ## adjust the scheduler_interval according to the frames sent by the serial port
    scheduler_interval = 100
    scheduler = tornado.ioloop.PeriodicCallback(checkQueue, scheduler_interval)
    scheduler.start()
    mainLoop.start()
