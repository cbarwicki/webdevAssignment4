import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import AccountBalance from './AccountBalance'

class Credits extends Component {

    constructor () {  // Create and initialize state
        super()
        this.state = {
          description: '',
          amount: '',
          redirect: false
        }

    }

    // When the description input is changed, capture the input and update the state 
    handleChangeDescription = (e) => {
        let updatedDescription = {...this.state.description}
        const inputValue = e.target.value
        updatedDescription = inputValue

        this.setState({description: updatedDescription})
    }

    // When the amount input is changed, capture the input and update the state 
    handleChangeAmount = (e) => {
        let updatedAmount = {...this.state.amount}
        const inputValue = e.target.value
        updatedAmount = inputValue

        this.setState({amount: updatedAmount})
    }

    // When user clicked submit button, store credit data and then redirect to Credits page
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.addCredit(this.state.description, this.state.amount)
        this.setState({redirect: true})
    }

    render() {
        if (this.state.redirect) {  // Redirect to Home page when Submit button is clicked
            return (<Redirect to="/"/>)
          }
    
        return (
            <div>
            <h1>Your Credits</h1>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor="description">Description</label>
                        <input type="text" name="description" onChange={this.handleChangeDescription} value={this.state.description} />
                    </div>
                    <div>
                        <label htmlFor="amount">Amount</label>
                        <input type="text" name="amount" onChange={this.handleChangeAmount} value={this.state.amount} />
                    </div>
                    <button>Add Credit</button>
                </form>
                <AccountBalance accountBalance={this.props.accountBalance}/>
            {
                this.props.credits.map( (entry) => {
                    return (
                        <div>
                            <p>Description: {entry.description}</p>
                            <p>Amount: {entry.amount}</p>
                            <p>Date: {entry.date}</p>
                            <p>-----------------------</p>
                        </div>
                    )
                })
            }
            </div>
        )
    }
}

export default Credits;
