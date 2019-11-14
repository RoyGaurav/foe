from .fightlog import FightLog

class NoahFightLog():
    def get(self):
        fl = FightLog()
        fightLog = fl.getFightLog()
        return  fightLog
       
class NoahMembersList():
    def get(self):
        fl = FightLog()
        memberList = fl.getMemberList()
        return  memberList

class NoahMemberFightLog():
    def get(self,playerid):
        fl = FightLog()
        memberFightLog = fl.getFightDetails(playerid)
        return  memberFightLog
