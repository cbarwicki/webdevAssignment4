// src/App.js

import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import axios from 'axios';
import Debits from './components/Debits';
// import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0,
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '07/23/96',
      },
      credits: [],
      debits: []
    }
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser}
    newUser.userName = logInInfo.userName
    this.setState({currentUser: newUser})
  }

  // connects to API for credits and debits
  async componentDidMount(){
    let linkToCreditsAPI = 'https://moj-api.herokuapp.com/credits';
    let linkToDebitsAPI = 'https://moj-api.herokuapp.com/debits';

    try{
      let response = await axios.get(linkToCreditsAPI);
      this.setState({credits: response.data});
      response = await axios.get(linkToDebitsAPI);
      this.setState({debits: response.data});
    }
    catch(error){
      if (error.response){
        console.log(error.response.data);
        console.log(error.response.status);
      }
    }
  }

  // Updates accountBalance with info from credits and debits
  componentDidUpdate(prevProps, prevState) {
    let balance = this.state.accountBalance
    if (this.state.debits !== prevState.debits) {
      this.state.debits.map( (entry) =>
        balance -= entry.amount
      )
      balance = balance.toFixed(2)
      this.setState({accountBalance: balance})
    }
    if (this.state.credits !== prevState.credits) {
      this.state.credits.map( (entry) =>
        balance += entry.amount
      )
      balance = balance.toFixed(2)
      this.setState({accountBalance: balance})
    }
  }

  // Add credit and update accountBalance
  addCredit = (description, amount) => {
    const today = new Date().toISOString();
    const newEntry = {
      id: "0",
      description: description,
      amount: amount,
      date: today
    }
    this.state.credits.push(newEntry)
    const updatedBalance = (parseFloat(this.state.accountBalance) + parseFloat(newEntry.amount))
    this.setState({accountBalance: updatedBalance})
  }

  // Add debit and update accountBalance
  addDebit = (description, amount) => {
    const today = new Date().toISOString();
    const newEntry = {
      id: "0",
      description: description,
      amount: amount,
      date: today
    }
    this.state.debits.push(newEntry)
    const updatedBalance = (parseFloat(this.state.accountBalance) - parseFloat(newEntry.amount).toFixed(2))
    this.setState({accountBalance: updatedBalance})
  }



  // Create Routes and React elements to be rendered using React components
  render() {  
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance}/>);
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince}  />
    );
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)  // Pass props to "LogIn" component
    const CreditsComponent = () => (<Credits credits={this.state.credits} addCredit={this.addCredit} accountBalance={this.state.accountBalance} />);
    const DebitsComponent = () => (<Debits debits={this.state.debits} addDebit={this.addDebit} accountBalance={this.state.accountBalance} />);

    return (
      <Router>
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;