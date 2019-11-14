import json
class Member:
    def __init__(self):
        self.rank = ""
        self.avatar = ""
        self.name = ""
        self.points = ""
        self.battles = ""
        self.playerid = ""
        self.pointsGainedLastDay = ""
        self.fightList = []

    def setRank(self, value):
        self.rank = value

    def setAvatar(self, value):
        self.avatar = value

    def setName(self, value):
        self.name = value
    
    def setPoints(self, value):
        self.points = value

    def setBattles(self, value):
        self.battles = value

    def setPlayerid(self, value):
        self.playerid = value

    def setPointsGainedLastDay(self, value):
        self.pointsGainedLastDay = value

    def addFight(self, flist):
        self.fightList.append(flist)

    def toJSON(self) :
        return json.loads(json.dumps(self, default=lambda o: o.__dict__, ensure_ascii=False))
