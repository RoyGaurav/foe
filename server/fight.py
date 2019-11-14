import json
class Fight:
    def __init__(self) :
        self.fdate = None
        self.ftime = None
        self.fights = None

    def setFDate(self,value) :
        self.fdate = value

    def setFTime(self,value) :
        self.ftime = value

    def setFights(self,value) :
        self.fights = value

    def toJSON(self) :
        return json.loads(json.dumps(self, default=lambda o: o.__dict__, ensure_ascii=False))