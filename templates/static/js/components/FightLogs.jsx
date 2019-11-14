import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
export default class FightLogs extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isFetching: false,
         users: {},
         rows: [],
         columnHeader: [],
      };
   }

   escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
   }

   replaceAll(str, term, replacement) {
      return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
   }

   componentDidMount() {
      let date = new Date();
      let timestamp = date.getTime();
      if (localStorage.getItem('DATA_FETCHED_TIME') && localStorage.getItem('users')) {
         let diff = Math.abs(date - localStorage.getItem('DATA_FETCHED_TIME')) / 36e5;
         if (diff > 5) {
            this.fetchData(timestamp);
         } else {
            let users = JSON.parse(localStorage.getItem('users'));
            users.data = this.getFightsListInAMonth(users.data);
            let rowData = users.data.map((item) => {
               return {
                  rank: this.getValue(item.rank),
                  name: item.name,
                  totalPoints: this.getValue(item.points),
                  pointsGainedLastDay: this.getValue(item.pointsGainedLastDay),
                  weeklyFightCount: this.getValue(item.weeklyFightCount),
                  monthlyFightCount: this.getValue(item.monthlyFightCount),
                  totalFightCount: this.getValue(item.battles)
               }
            });
            this.setState({
               users: users,
               isFetching: false,
               rows: rowData,
               columnHeader: this.getColumnHeader()
            })
         }
      } else {
         this.fetchData(timestamp);
      }
   }

   getValue(val) {
      if (typeof val === 'string')
         val = parseInt(this.replaceAll(val, ',', ''))

      if (val <= 0)
         val = '' + val;

      return val;
   }

   getFightsListInAMonth(usersData) {
      let users = Object.assign(usersData);
      let fightsListHeader = [];
      users.map((user, index) => {
         let fightsList = [];
         let fightLength = user.fightList.length;
         let monthlyFightCount = 0;
         let weeklyFightCount = 0;
         let lastWeeklyCounter = parseInt(user.battles.replace(',', ''));
         let lastMonthlyCounter = parseInt(user.battles.replace(',', ''));
         for (let i = fightLength - 1; i > fightLength - 31; i--) {
            let fights = user.fightList[i];
            let fkey = fights.fdate;
            let fvalue = fights.fights;
            fvalue = parseInt(fvalue);
            if (i > fightLength - 8) {
               let diff = fvalue - lastWeeklyCounter;
               if (diff < 0)
                  diff = diff * (-1);
               weeklyFightCount = weeklyFightCount + diff;
               lastWeeklyCounter = fvalue;
            }
            let diff = fvalue - lastMonthlyCounter;
            if (diff < 0)
               diff = diff * (-1);
            monthlyFightCount = monthlyFightCount + diff;
            lastMonthlyCounter = fvalue;
            !fightsListHeader.includes(fkey) && fightsListHeader.push(fkey)
            fightsList.push({
               [fkey]: fvalue
            });
         }
         user.fightList = fightsList;
         user.monthlyFightCount = monthlyFightCount;
         user.weeklyFightCount = weeklyFightCount;
         users[index] = user;
      });
      return users;
   }

   getColumnHeader() {
      return [
         {
            label: 'Rank',
            field: 'rank',
            sort: 'asc',
            width: 150
         }, {
            label: 'Name',
            field: 'name',
            sort: 'asc',
            width: 150
         }, {
            label: 'Total Points',
            field: 'totalPoints',
            sort: 'desc',
            width: 150
         }, {
            label: 'Points Gained Last Day',
            field: 'pointsGainedLastDay',
            sort: 'desc',
            width: 150
         }, {
            label: 'Total Fights in Last 7 days',
            field: 'weeklyFightCount',
            sort: 'desc',
            width: 150
         }, {
            label: 'Total Fights in Last 30 Days',
            field: 'monthlyFightCount',
            sort: 'desc',
            width: 150
         }, {
            label: 'Total Fights',
            field: 'totalFightCount',
            sort: 'desc',
            width: 150
         }
      ];
   }

   fetchData(timestamp) {
      this.fetchMemberDetails().then(data => {
         data.data = this.getFightsListInAMonth(data.data);
         let rowData = data.data.map((item) => {
            return {
               rank: this.getValue(item.rank),
               name: item.name,
               totalPoints: this.getValue(item.points),
               pointsGainedLastDay: this.getValue(item.pointsGainedLastDay),
               weeklyFightCount: this.getValue(item.weeklyFightCount),
               monthlyFightCount: this.getValue(item.monthlyFightCount),
               totalFightCount: this.getValue(item.battles)
            }
         });
         this.setState({
            users: data,
            isFetching: false,
            rows: rowData,
            columnHeader: this.getColumnHeader()
         });

         localStorage.setItem('users', JSON.stringify(data));
         localStorage.setItem('DATA_FETCHED_TIME', timestamp)
      });
   }
   fetchMemberDetails() {
      this.setState({
         isFetching: true
      });
      return new Promise((resolve, reject) => {
         fetch('/api/v1/noah-fight-logs', { mode: 'no-cors' }).then(response => {
            if (response.status === 200) {
               resolve(response.json())
            } else {
               reject(response)
            }
         }).catch(error => reject(error));
      })
   }
   fetchMemberList() {
      return new Promise((resolve, reject) => {
         fetch('/api/v1/noah-member-list', { mode: 'no-cors' }).then(response => {
            if (response.status === 200) {
               resolve(response.json())
            } else {
               reject(response)
            }
         }).catch(error => reject(error));
      })
   }

   fetchMemberFightLog() {
      return new Promise((resolve, reject) => {
         let users = [];
         this.fetchMemberList().then(members => {
            let done = 1;
            members.data.map((member, index) => {
               let url = '/api/v1/noah-member-fight-logs/' + member.playerid;
               fetch(url).then(response => {
                  if (response.status === 200) {
                     response.json().then(data => {
                        data.map(fight => {
                           let f = Object.assign(fight);
                           member.fightList.push(f)
                           member = Object.assign(member)
                        });
                        users.push(Object.assign(member));
                        if (users.length === members.data.length)
                           resolve(users);
                     })
                  } else {
                     console.log('Error Fetching Fight Details  :: ' + member.name);
                     reject(response);
                  }
               }).catch((error) => {
                  console.log('Error Fetching Fight Details : ' + member.name);
                  reject(error);
               });
               done++;
            });

         }).catch(error => reject(error));
      })
   }

   getView() {
      if (this.state.isFetching) {
         return <div className="loading">
            <i className="fa fa-refresh fa-spin fa-3x fa-fw"></i>
            <span className="sr-only">Loading...</span>
            <div>Please wait it will take around 2 minutes to load the data. Thanks for the patience!</div>
         </div>;
      } else {
         let data = {
            columns: this.state.columnHeader,
            rows: this.state.rows
         };
         return <MDBDataTable
            striped
            bordered
            data={data}
            responsive
            paging={false}
            order={['weeklyFightCount', 'desc']}
         />;
      }
   }

   render() {
      let view = this.getView();
      return (
         <div>
            <h1>FightLogs!</h1>
            {view}
         </div>
      )
   }
}