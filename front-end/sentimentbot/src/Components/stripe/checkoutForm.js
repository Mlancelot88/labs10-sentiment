import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";

import "../App.css";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = { complete: false };
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    let { token } = await this.props.stripe.createToken({ name: "Name" });
    let response = await fetch("http://localhost:5002/charge", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: token.id
    });

    if (response.ok)
      this.setState({
        complete: true
      });
    console.log("Purchase Complete!");
  }

  render() {
    if (this.state.complete) {
        return ( 
          <div className="purchase-complete">
            <h1>Purchase Complete</h1>;
          </div>
        )
    } else {
      return (
        <div className="checkout">
          <p>Would you like to complete the purchase?</p>
          <div className="card-elements">
            <CardElement />
          </div>
          <button onClick={this.submit}>Send</button>
        </div>
      );
    }
  }
}

export default injectStripe(CheckoutForm);
