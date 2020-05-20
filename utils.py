import time
import os


def log(*args, **kwargs):
    path = 'logs'
    if not os.path.exists(path):
        os.makedirs(path)

    log_format = "%Y-%m-%d"
    filename = time.strftime(log_format, time.localtime())
    filename = filename + '.txt'
    filename = os.path.join(path, filename)
    with open(filename, 'a', encoding='utf-8') as f:
        date_format = '%H:%M:%S'
        dt = time.strftime(date_format, time.localtime())
        print(dt, *args, file=f, **kwargs)
