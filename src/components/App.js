/**
 * Chillydwags App.js
 * A collection of tools/utilities to help make coaching a little easier.
 * 
 * From this file we pull in sitewide components (header/footer), and pull 
 * in the large pieces of the app (roster)
 */
import React, { Component } from 'react';
import Header from './Header';
import Roster from './Roster';
import Home from './Home';
import Footer from './Footer';
import Loading from './Loading';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom'

class App extends Component {

  //define the project basename; will either be "" or "https://www.jmar.dev/chillydwags"
  PROJECT_HOME = `${process.env.PUBLIC_URL}/`;

  componentDidMount() {
    //https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser/53883824#53883824
    //This just helps with the scroll/wiggle on mobile
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

  }
  render() {
    //not in use currently
    let logged_in = true;

    //TODO: user accounts, registration
    if (logged_in) {
      return (
        <div className="chillydwags-manager-viewport" >
          <Router basename={this.PROJECT_HOME}>
            <Header />
            <Route exact path="/" render={() => (
              <Redirect to="/dashboard" />
            )} />
            <Route path="/dashboard" component={Home} />
            <Route path="/roster" component={Roster} />
            <Route path="/attendance"
              render={(props) => <Roster {...props} takeAttendance={true} />}
            />
            <Route path="/loading-screen" component={Loading} />
          </Router>
          <Footer />
        </div>
      );
    } else {
      //just show the logo and the team name for now
      return (
        <div className="chillydwags-manager-viewport" >
          <Loading noSpinner={true} text="Chillydwags" />
          <Footer />
        </div>
      )
    }
  }
}

export default App;