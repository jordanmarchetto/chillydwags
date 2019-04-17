/**
 * Chillydwags App.js
 * A collection of tools/utilities to help make coaching a little easier.
 * 
 * From this file we pull in sitewide components (header/footer), and pull 
 * in the large pieces of the app (roster)
 * 
 * TODO: Better error handling/displaying
 */
import React, { Component } from 'react';
import Header from './Header';
import Roster from './Roster';
import Home from './Home';
import Footer from './Footer';
import Loading from './Loading';
import UserLogin from './UserLogin';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom'
import Cookies from 'universal-cookie';

class App extends Component {

  //define the project basename; will either be "" or "https://www.jmar.dev/chillydwags"
  PROJECT_HOME = `${process.env.PUBLIC_URL}/`;

  state = { logged_in: false, loading: false, user: null }

  async componentDidMount() {
    //https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser/53883824#53883824
    //This just helps with the scroll/wiggle on mobile
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });


    //determine if we're logged in and all that good stuff
    let still_logged_in = false;
    let fetched_user = null;

    //get the token from our cookie
    const cookies = new Cookies();
    let token = cookies.get('token');
    if (token) {
      //if we have a token, make sure it's not expired
      let expir = new Date(token.expires_at);
      let now = new Date();

      //if not expired, try to query /user to see if token still works
      if (now < expir) {
        //set loading screen up
        this.setState({ loading: true });
        //try to GET /user using our token
        await fetch(process.env.REACT_APP_AUTH_API_URL + "/user", {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token.access_token,
          }
        }).then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        }).then(
          (result) => {
            //it worked, so we can stay logged in
            //console.log(result);
            still_logged_in = true;
            fetched_user = result;
          },
          (error) => {
            //the fetch failed, so we should log out
            //console.log(error);
            still_logged_in = false;
            //window.location = this.PROJECT_HOME + "login"; 
          }
        );
      } else {
        //token was expired
        still_logged_in = false;
      }
    }

    this.setState({ loading: false, logged_in: still_logged_in, user: fetched_user });
  } // end componentDidMount


  //handler for when the logout button gets pushed
  //throws up a loading screen then hits the /logout endpoint
  //when it's done, update the state, which should now result 
  //in us seeing the login form
  logoutHandler = async () => {
    const cookies = new Cookies();
    let token = cookies.get("token");
    this.setState({ loading: true });
    await fetch(process.env.REACT_APP_AUTH_API_URL + "/logout", {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token.access_token,
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Logout went wrong ...');
      }
    }).then(
      (result) => {
        //still_logged_in = true;
        //fetched_user = result;
      },
      (error) => {
        //console.log(error);
        //still_logged_in = false;
        //window.location = this.PROJECT_HOME + "login"; 
      }
    );
    cookies.remove('token');
    this.setState({ logged_in: false, user: null, loading: false });
    window.history.replaceState({}, "Login", "login");
  } //end logout handler

  render() {
    const { logged_in, loading, user } = this.state;
    if (loading) {
      return (
        <Loading />
      )
    }

    if (logged_in) {
      return (
        <div className="chillydwags-manager-viewport" >
          <Router basename={this.PROJECT_HOME}>
            <Header logoutHandler={this.logoutHandler} user={user} />
            <Route exact path="/" render={() => (
              <Redirect to="/dashboard" />
            )} />
            <Route path="/dashboard" render={(props) => <Home {...props} user={user} />} />
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
      return (
        <div className="chillydwags-manager-viewport" >
          <UserLogin />
          <Footer />
        </div>
      )
    }
  }
}

export default App;
