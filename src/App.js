import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from "axios";
import Map from "./Map";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCode: "",
      data: []
    };

    this.updateZipCode = this.updateZipCode.bind(this);
  }

  componentDidUpdate() {
    console.log(this.state.data);
  }

  findPizza() {
    console.log(this.state.zipCode + " is the zip code");
    // fire request off

    if (this.state.zipCode.length === 5) {
      if (
        parseInt(this.state.zipCode) > 0 &&
        parseInt(this.state.zipCode) <= 99999
      ) {
        axios
          .get(
            "https://xqgy0d8a3l.execute-api.us-east-1.amazonaws.com/Prod/places/" +
              this.state.zipCode,
            { crossdomain: true }
          )
          .then(function(response) {
            console.log(
              "response is : " + JSON.stringify(response.data.results)
            );
            var parsedData = response.data.results;
            let pizzaPlaces = parsedData.map(place => {
              console.log(place);
              return (
                <div key={place.place_id}>
                  <p>{place.name}</p>
                  <p>{place.formatted_address}</p>
                </div>
              );
            });
            this.setState({ data: pizzaPlaces });
          })
          .catch(function(error) {
            if (error.response) {
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log(error.message);
            }
            console.log(error.config);
          });
      }
    } else {
      console.log("invalid zip code");
    }
  }

  updateZipCode(evt) {
    this.setState({
      zipCode: evt.target.value
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <h1 className="text-center">Pizza Now</h1>
          <h2>Your one stop shop for finding pizza near you</h2>

          <h4>Enter your zip code below to find pizza now</h4>
          <input
            placeholder="Zip Code"
            type="number"
            value={this.state.zipCode}
            onChange={evt => this.updateZipCode(evt)}
          />
          <br />
          <button onClick={() => this.findPizza()}>Find Pizza Now</button>
        </div>
        <br />
        <br />
        <div>{this.state.data}</div>
        <Map />
      </React.Fragment>
    );
  }
}

export default App;
