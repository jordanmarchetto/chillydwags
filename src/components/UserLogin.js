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

class UserLogin extends Component {

    state = {
        login: true,
        signup: false,
        forgot_pw: false,
    };

    showLogin = () =>{
        this.setState({login:true, signup:false, forgot_pw:false});
    }
    showSignup = () =>{
        this.setState({login:false, signup:true, forgot_pw:false});
    }
    showForgotpw = () =>{
        this.setState({login:false, signup:false, forgot_pw:true});
    }

    submitLogin = () => {
        console.log('submit login')

    }
    submitForgotPassword = () => {
        console.log('submit forgot password')

    }
    submitRegistration = () => {
        console.log('submit registration form')

    }

    render() {
        const {login, signup, forgot_pw} = this.state;
        return (
            <div className="login-screen">
                <div className="logo-wrapper">
                    <img src={chillydawgs_logo} alt="Chillydwags Logo" />
                </div>
                {login?( <UserLoginForm showForgotpw={this.showForgotpw} showSignup={this.showSignup} submitForm={this.submitLogin} />):''}
                {signup?( <UserRegistrationForm showForgotpw={this.showForgotpw} showLogin={this.showLogin} submitForm={this.submitRegistration} />):''}
                {forgot_pw?( <UserForgotPassword showSignup={this.showSignup} showLogin={this.showLogin} submitForm={this.submitForgotPassword} />):''}
            </div>
        )
    }
}
export default UserLogin;