import React, { Component } from 'react';
export default class MemberDetails extends Component {
   render() {
      const { params } = this.props.match
      return (
         <div>
            <h1>Hello MemberDetails! {params.id}</h1>
            <p>Under Construction</p>
         </div>
      )
   }
}