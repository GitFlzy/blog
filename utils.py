import time

def log(*args, **kwargs):
    format = '%H:%M:%S'
    value = time.localtime(int(time.time()))
    dt = time.strftime(format, value)
    time_format = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 
    filename = time_format + '.txt'
    with open(filename, 'a', encoding='utf-8') as f:
        print(dt, *args, file=f, **kwargs)
