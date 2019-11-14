from templates import app
from server.restful import NoahFightLog,NoahMembersList,NoahMemberFightLog

app.config.from_object('configurations.DevelopmentConfig')

@app.route('/api/v1/noah-fight-logs', methods=['GET'])
def getFightLogs() :
    res = NoahFightLog()
    return res.get()

@app.route('/api/v1/noah-member-list', methods=['GET'])
def getMembersList() :
    res = NoahMembersList()
    return res.get()

@app.route('/api/v1/noah-member-fight-logs/<playerid>', methods=['GET'])
def getMemberDetails(playerid) :
    res = NoahMemberFightLog()
    return res.get(playerid)

if __name__ == '__main__':
    app.run(debug=True, port=5002)
