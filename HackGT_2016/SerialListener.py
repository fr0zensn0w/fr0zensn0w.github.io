import json
import logging
import serial
import multiprocessing


logging.basicConfig()
logger = logging.getLogger('SERIAL_OUT')
logger.setLevel(logging.INFO)


class UsbReader(multiprocessing.Process):
    def __init__(self, message_queue=None, num_rows=1, num_cols=2, verbose=False):
        """Initialize the UsbReader object with serial configuration.

        :param web_socket_handler: WebSocketHandler object to manage sending
        data over web.
        """
        multiprocessing.Process.__init__(self)
        # Configure serial connection.
        self.ser = serial.Serial(
                port='/dev/tty.usbmodem1411',
                baudrate=115200,
                bytesize=serial.EIGHTBITS,
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE,
                )
        # Two dimensional array of bins. Initialize with number of rows and
        # number of columns.
        self.bin_status = [[0]*num_cols]*num_rows
        self.message_queue = message_queue 
        self.verbose = verbose

    def run(self):
        """Begin reading the serial port for data, and update bin_status
        dictionary with button status."""
        logger.info('Reading USB')
        while self.ser.isOpen():
            out = (self.ser.readline().decode('UTF8').replace('\r\n', '')
                    .replace('\r', '').replace('\n', ''))
            # Split comma delimited data of format rXcYvZ
            # TODO(carden): Split with regex:
            # http://stackoverflow.com/questions/4998629/python-split-string-with-multiple-delimiters
            bin_arr = out.split(',')
            new_data = []
            for s in bin_arr:
                # Read a string of format rXcYvZ.
                if len(s) == 6:
                    row, col, val = ([int(v) for v in s[1::2]])
                    if self.bin_status[row][col] != val:
                        self.bin_status[row][col] = val
                        new_data.append({'row': row, 'column': col, 'value': val})
                    if self.message_queue and len(new_data) > 0:
                        for d in new_data:
                            self.message_queue.put(d)

                    if len(new_data) > 0 and self.verbose:
                        # Log the current status.
                        logger.info('new_data: {}'.format(new_data))
        logger.info('USB no longer open.')

    def close(self):
        self.ser.close()


if __name__ == '__main__':
    reader = UsbReader(verbose=True)
    reader.start_reading()

