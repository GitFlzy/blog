import json
import time
from utils import log
from pymongo import MongoClient
import random
from bson.objectid import ObjectId


mongodb = MongoClient(host='app-mongodb', port=27017)
# mongodb = MongoClient(host='localhost', port=27017)


def timestamp():
    return int(time.time())


class Mongodb(object):
    __fields__ = [
        '_id',
        # (字段名, 类型, 值)
        # ('id', int, -1),
        ('type', str, ''),
        ('created_time', int, 0),
        ('updated_time', int, 0),
        ('deleted', bool, False),
    ]

    @classmethod
    def has(cls, **kwargs):
        """
        检查一个元素是否在数据库中 用法如下
        User.has(id=1)
        :param kwargs:
        :return:
        """
        return cls.find_one(**kwargs) is not None

    def mongos(self, name):
        return mongodb.db[name]._find()

    def __repr__(self):
        class_name = self.__class__.__name__
        properties = ('{0} = {1}'.format(k, v)
                      for k, v in self.__dict__.items())
        return '<{0}: \n  {1}\n>'.format(class_name, '\n  '.join(properties))

    @classmethod
    def new(cls, form=None, **kwargs):
        """
        new 是给外部使用的函数
        """
        name = cls.__name__
        # 创建一个空对象
        m = cls()
        # 把定义的数据写入空对象, 未定义的数据输出错误
        fields = cls.__fields__.copy()
        # 去掉 _id 这个特殊的字段
        log('new m fields', fields)
        fields.remove('_id')
        if form is None:
            form = {}

        for f in fields:
            key, _type, val = f
            if key in form:
                setattr(m, key, _type(form[key]))
            else:
                # 设置默认值
                setattr(m, key, val)
        # 处理额外的参数 kwargs
        for k, v in kwargs.items():
            if hasattr(m, k):
                setattr(m, k, v)
            else:
                raise KeyError
        # 写入默认数据
        ts = int(time.time())
        m.created_time = ts
        m.updated_time = ts
        # m.deleted = False
        m.type = name.lower()
        # 特殊 model 的自定义设置
        # m._setup(form)
        m.save()
        return m

    @classmethod
    def _new_with_bson(cls, bson, **kwargs):
        """
        这是给内部 all 这种函数使用的函数
        从 mongo 数据中恢复一个 model
        bson 代表一个 mongo 对象
        """
        m = cls()
        fields = cls.__fields__.copy()
        log('恢复的字段 fields', fields, '对应的 classname', cls.__name__)
        # 去掉 _id 这个特殊的字段
        fields.remove('_id')
        log('bson', bson)
        for f in fields:
            k, t, v = f
            if k in bson:
                setattr(m, k, bson[k])
            else:
                # 设置默认值
                setattr(m, k, v)
        setattr(m, '_id', bson['_id'])

        buf = cls()
        proj = kwargs.pop('projection', {})
        for key in proj.keys():
            if proj[key] and hasattr(m, key):
                setattr(buf, key, getattr(m, key))

        if len(buf.__dict__) > 0:
            m = buf

        return m

    @classmethod
    def all(cls, **kwargs):
        items = cls.find_all(**kwargs)
        return items

    @classmethod
    def _find(cls, **kwargs):
        """
        mongo 数据查询
        """
        name = cls.__name__
        log('mongodb find by kwargs', kwargs)

        proj = kwargs.pop('projection', {})
        log('after pop projection, kwargs', kwargs)
        ds = mongodb.db[name].find(kwargs)
        log('从数据库中找到的数据', ds)

        flag_sort = '__sort'
        sort = kwargs.pop(flag_sort, None)
        if sort is not None:
            ds = ds.sort(sort)

        l = [cls._new_with_bson(d, projection=proj) for d in ds]
        # log('find data from mongodb', l)
        return l

    @classmethod
    def _find_raw(cls, **kwargs):
        name = cls.__name__
        ds = mongodb.db[name]._find(kwargs)
        l = [d for d in ds]
        return l
        # 直接 list() 就好了
        # return list(l)

    @classmethod
    def _clean_field(cls, source, target):
        """
        清洗数据用的函数
        例如 User._clean_field('is_hidden', 'deleted')
        把 is_hidden 字段全部复制为 deleted 字段
        """
        ms = cls._find()
        for m in ms:
            v = getattr(m, source)
            setattr(m, target, v)
            m.save()

    @classmethod
    def find_by(cls, **kwargs):
        return cls.find_one(**kwargs)

    @classmethod
    def find_all(cls, **kwargs):
        kwargs['deleted'] = False
        return cls._find(**kwargs)

    @classmethod
    def find(cls, id):
        return cls.find_one(id=id)

    @classmethod
    def get(cls, id):
        return cls.find_one(id=id)

    @classmethod
    def find_one(cls, **kwargs):
        kwargs['deleted'] = False
        l = cls._find(**kwargs)
        if len(l) > 0:
            return l[0]
        else:
            return None

    @classmethod
    def upsert(cls, query_form, update_form, hard=False):
        ms = cls.find_one(**query_form)
        if ms is None:
            query_form.update(**update_form)
            ms = cls.new(query_form)
        else:
            ms.update(update_form, hard=hard)
        return ms

    def update(self, form, hard=False):
        for k, v in form.items():
            if hard or hasattr(self, k):
                setattr(self, k, v)
        # self.updated_time = int(time.time()) fixme
        self.save()

    def save(self):
        name = self.__class__.__name__
        mongodb.db[name].save(self.__dict__)

    def delete(self):
        name = self.__class__.__name__
        query = {
            '_id': ObjectId(self._id),
        }
        values = {
            'deleted': True
        }
        mongodb.db[name].update_one(query, values)
        # self.deleted = True
        # self.save()

    def blacklist(self):
        b = [
            '_id',
        ]
        return b

    def json(self):
        _dict = self.__dict__
        d = {k: v for k, v in _dict.items() if k not in self.blacklist()}
        # TODO, 增加一个 type 属性
        return d

    def data_count(self, cls):
        """
        神奇的函数, 查看用户发表的评论数
        u.data_count(Comment)

        :return: int
        """
        name = cls.__name__
        # TODO, 这里应该用 type 替代
        fk = '{}_id'.format(self.__class__.__name__.lower())
        query = {
            fk: self._id,
        }
        count = mongodb.db[name]._find(query).count()
        return count
