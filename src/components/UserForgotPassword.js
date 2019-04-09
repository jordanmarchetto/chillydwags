/**
 * UserLoginForm.js
 * Simple component to just show the logo and potentially some text
 * Props:
 *  noSpinner - true/false
 *  text - text to be displayed below the logo in place of spinner
 */
import React, { Component } from 'react';
import '../css/loading.css';
import { TextField } from '@material-ui/core';
import { Send, ChevronLeft } from '@material-ui/icons';

class UserForgotPassword extends Component {
    render() {
        return (
            <div className="login-wrapper">
                <div className="login-form">
                    <h2>Forgot Password</h2>
                    <TextField
                        name="password"
                        className="edit-field"
                        id="edit_password"
                        variant="outlined"
                        InputLabelProps={{
                            classes: {
                                focused: "input-focused",
                            }
                        }}
                        InputProps={{
                            classes: {
                                root: "input-root",
                                focused: "input-focused",
                                notchedOutline: "input-notchedOutline"
                            },
                        }}
                        label="Password"
                    />
                    <button className="btn btn-submit">Submit <Send className="inline-icon submit-icon" /></button>
                </div>
                <div className="login-links">
                    <a onClick={this.props.showLogin} href="#login"><ChevronLeft className="inline-icon" fontSize="small" />Login</a>
                    <a onClick={this.props.showSignup} href="#sign-up">Sign Up</a>
                </div>
            </div>
        )
    }
}

export default UserForgotPassword;