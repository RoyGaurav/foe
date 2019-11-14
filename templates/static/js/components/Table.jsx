import React, { Component } from 'react';

export default class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: {},
            totalPlayers: 0,
            fightsListHeader: [],
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.users && props.users.data) {
            let users = state.getFightsListInAMonth(props.users.data);
            return {
                users: users,
                totalPlayers: props.users.totalPlayers
            };
        }
        return null;
    }

    // getFightsListInAMonth(usersFromProps) {
    //     let users = Object.assign(usersFromProps);
    //     let fightsListHeader = [];
    //     users.map((user,index)=>{
    //         let fightsList = [];
    //         let fightLength = user.fightList.length;
    //         let monthlyFightCount = 0;
    //         let weeklyFightCount = 0;
    //         let lastWeeklyCounter = parseInt(user.battles.replace(',',''));
    //         let lastMonthlyCounter = parseInt(user.battles.replace(',',''));
    //         for(let i = fightLength-1; i> fightLength-31; i--) {
    //             let fights = user.fightList[i];
    //             let fkey = fights.fdate;
    //             let fvalue = fights.fights;
    //             fvalue = parseInt(fvalue);
    //             if(i > fightLength-8) {
    //                 let diff = fvalue - lastWeeklyCounter;
    //                 if(diff < 0) 
    //                     diff = diff * (-1);
    //                 weeklyFightCount = weeklyFightCount + diff;
    //                 lastWeeklyCounter = fvalue;
    //             }
    //             let diff = fvalue - lastMonthlyCounter;
    //                 if(diff < 0) 
    //                     diff = diff * (-1);
    //             monthlyFightCount = monthlyFightCount + diff;
    //             lastMonthlyCounter = fvalue;
    //             !fightsListHeader.includes(fkey) && fightsListHeader.push(fkey)
    //             fightsList.push({
    //                 [fkey]:fvalue
    //             });
    //         }
    //         user.fightList = fightsList;
    //         user.monthlyFightCount = monthlyFightCount;
    //         user.weeklyFightCount = weeklyFightCount;
    //         users[index] = user;
    //     });
    //     return users;
    // }

    getTableBodyView() {
        let users = this.state.users
        return users.map((user) => {
            return <tr key={user.playerid}><td key={user.rank + '_rnk'}>{parseInt(user.rank.replace(',', ''))}</td><td key={user.rank + '_name'}>{user.name}</td><td key={user.rank + '_pts'}>{user.points}</td><td key={user.rank + '_ptsInDay'}>{user.pointsGainedLastDay}</td><td key={user.rank + '_fightsInWeek'}>{user.weeklyFightCount}</td><td key={user.rank + '_fightsInMonth'}>{user.monthlyFightCount}</td><td key={user.rank + '_fights'}>{user.battles}</td></tr>
        });
    }

    getTableHeadView() {
        return this.state.columnHeader.map((column, index) => {
            return <th key={index}>{column.toUpperCase()}</th>;
        });
    }

    getView() {
        if (this.state.isFetching) {
            return <div className="loading">loading...</div>
        } else {
            let headers = this.getTableHeadView();
            let rows = <tr></tr>;
            return <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        {headers}
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>;
        }
    }

    render() {
        let view = this.getView();
        if (Object.keys(this.state.users).length !== 0 && this.state.users.constructor !== Object)
            rows = this.getTableBodyView();
        return (
            {view}
        )
    }
}