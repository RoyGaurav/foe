from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup
from .personlist import PersonList
from .person import Member
from .fight import Fight
import json
import re
import xlwt 
from xlwt import Workbook 

GUILD_ID = "4914"
class FightLog:
    def __init__(self) : 
        print('fightlog')

    def getMemberList(self) :
        memberList = PersonList()
        guild_url = "https://foestats.com/us/us10/getMembers.php?id="+GUILD_ID+"&server=us10&draw=1"
        gClient=uReq(guild_url)
        guild_html= gClient.read()
        gClient.close()
        guild_soup=BeautifulSoup(guild_html,features="html.parser")
        guild_json_output= BeautifulSoup(str(guild_soup.find(text=True)), 'lxml')
        guild_json_text=guild_json_output.get_text()
        guild_json_data = json.loads(guild_json_text)
        memberList.setTotalPlayer(guild_json_data['recordsTotal'])
        for member in guild_json_data['data']:
            detail = Member()
            detail.setRank(member[0])
            detail.setAvatar(member[1])
            detail.setName(member[2])
            detail.setPoints(member[3])
            detail.setBattles(member[4])
            detail.setPlayerid(member[5])
            detail.setPointsGainedLastDay(member[6])
            memberList.addData(detail)
        retVal = memberList.toJSON()
        return retVal

    def getFightDetails(self, playerId) :
        fightList = []
        member_url = "https://foestats.com/us/us10/getBattlesChart.php?id="+playerId+"&server=us10"
        mClient=uReq(member_url)
        member_html = mClient.read()
        mClient.close()
        member_soup=BeautifulSoup(member_html,features="html.parser")
        member_json_output= BeautifulSoup(str(member_soup.find(text=True)), 'lxml')
        member_json_text=member_json_output.get_text()
        member_fight_list = member_json_text.splitlines()
        for fight in member_fight_list :
            fd = fight.split()
            try:
                fightDetail = Fight()
                fightDetail.setFDate(fd[0])
                fightDetail.setFTime(fd[1])
                fightDetail.setFights(fd[2])
                fightList.append(fightDetail.toJSON())
            except TypeError as te:
                print(te)
        return json.dumps(fightList, ensure_ascii=False)

    def getFightLog(self):
        memberList = PersonList()
        guild_url = "https://foestats.com/us/us10/getMembers.php?id="+GUILD_ID+"&server=us10&draw=1"
        gClient=uReq(guild_url)
        guild_html= gClient.read()
        gClient.close()
        guild_soup=BeautifulSoup(guild_html,features="html.parser")
        guild_json_output= BeautifulSoup(str(guild_soup.find(text=True)), 'lxml')
        guild_json_text=guild_json_output.get_text()
        guild_json_data = json.loads(guild_json_text)
        memberList.setTotalPlayer(guild_json_data['recordsTotal'])
        for member in guild_json_data['data']:
            detail = Member()
            detail.setRank(member[0])
            detail.setAvatar(member[1])
            detail.setName(member[2])
            detail.setPoints(member[3])
            detail.setBattles(member[4])
            detail.setPlayerid(member[5])
            detail.setPointsGainedLastDay(member[6])
            memberList.addData(detail)
        i=0
        for member in memberList.data:
            member_url = "https://foestats.com/us/us10/getBattlesChart.php?id="+member.playerid+"&server=us10"
            mClient=uReq(member_url)
            member_html = mClient.read()
            mClient.close()
            member_soup=BeautifulSoup(member_html,features="html.parser")
            member_json_output= BeautifulSoup(str(member_soup.find(text=True)), 'lxml')
            member_json_text=member_json_output.get_text()
            member_fight_list = member_json_text.splitlines()
            for fight in member_fight_list :
                fd = fight.split()
                try:
                    fightDetail = Fight()
                    fightDetail.setFDate(fd[0])
                    fightDetail.setFTime(fd[1])
                    fightDetail.setFights(fd[2])
                    member.addFight(fightDetail)
                    memberList.replaceData(member,i)
                except TypeError as te:
                    print(te)
            i=i+1
        retVal = memberList.toJSON()
        return retVal

