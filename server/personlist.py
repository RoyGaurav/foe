import json
class PersonList :
    def __init__(self) :
        self.totalPlayer = 0
        self.data = []
    
    def setTotalPlayer(self, count) :
        self.totalPlayer = count

    def addData(self, data) :
        self.data.append(data)
    
    def replaceData(self, data, index) :
        self.data[index] = data
    
    def toJSON(self) :
        return json.loads(json.dumps(self, default=lambda o: o.__dict__, ensure_ascii=False))