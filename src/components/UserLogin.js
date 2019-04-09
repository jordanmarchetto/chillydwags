/**
 * UserLogin.js
 * Simple component to just show the logo and potentially some text
 * Props:
 *  noSpinner - true/false
 *  text - text to be displayed below the logo in place of spinner
 */
import React, { Component } from 'react';
import '../css/loading.css';
import chillydawgs_logo from '../images/chillydawgs_logo.png';
import UserLoginForm from './UserLoginForm';
import UserRegistrationForm from './UserRegistrationForm';
import UserForgotPassword from './UserForgotPassword';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import Cookies from 'universal-cookie';


class UserLogin extends Component {

    //define the project basename; will either be "" or "https://www.jmar.dev/chillydwags"
    PROJECT_HOME = `${process.env.PUBLIC_URL}/`;

    state = {
        login: true,
        signup: false,
        forgot_pw: false,
        success:null
    };

    submitLogin = (token) => {
        //store the token in a cookie
        const cookies = new Cookies();
        cookies.set('token', JSON.stringify(token), { path: '/'  });

        //redirect to the dashboard
        window.location = this.PROJECT_HOME + "dashboard"; 

    }
    submitForgotPassword = () => {
        console.log('submit forgot password')

    }
    submitRegistration = (message) => {
        //console.log('submit registration form callback')
        //window.location = this.PROJECT_HOME + "login"; 
    }

    render() {
        return (
            <div className="login-screen">
                <div className="logo-wrapper">
                    <img src={chillydawgs_logo} alt="Chillydwags Logo" />
                </div>

                <Router basename={this.PROJECT_HOME}>
                    <Route exact path="/" render={(props) =>
                        <UserLoginForm {...props} submitForm={this.submitLogin} />}
                    />
                    <Route exact path="/login" render={(props) =>
                        <UserLoginForm {...props} submitForm={this.submitLogin} />}
                    />
                    <Route exact path="/signup" render={(props) =>
                        <UserRegistrationForm {...props} submitForm={this.submitRegistration} />}
                    />
                    <Route exact path="/forgot-password" render={(props) =>
                        <UserForgotPassword {...props} submitForm={this.submitForgotPassword} />}
                    />
                </Router>
            </div>
        )
    }
}
export default UserLogin;