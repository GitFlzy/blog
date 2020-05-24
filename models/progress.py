import time
from models import Mongodb
from utils import log
# from models.user import User


class Progress(Mongodb):
    __fields__ = Mongodb.__fields__ + [
        # ('id', str, ''),
        ('created_time', int, 0),
        ('content', str, ''),
        ('version', str, ''),
    ]

    @classmethod
    def new(cls, form, **kwargs):
        entry = super().new(form, **kwargs)
        return entry

    @classmethod
    def find_by(cls, **kwargs):
        progress = super().find_by(**kwargs)
        log('find by id : progress', progress)
        # if blog is None or blog.deleted is True:
        #     return None
        return progress

    @classmethod
    def all(cls, **kwargs):
        progress = super().all(**kwargs)
        progress = progress[::-1]
        return progress

    def json(self):
        d = self.__dict__.copy()
        return d
