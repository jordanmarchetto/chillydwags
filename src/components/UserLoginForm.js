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
import { Send } from '@material-ui/icons';


class UserLoginForm extends Component {
    state = {validForm: true};
    render() {
        return (
            <div className="login-wrapper">
                <div className="login-form">
                    <h2>Log In</h2>
                    <TextField
                        name="email"
                        className="edit-field"
                        id="edit_email"
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
                        label="Email"
                    />
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
                    <button className="btn btn-submit" disabled={!this.state.validForm}>Submit <Send className="inline-icon submit-icon" /></button>
                </div>
                <div className="login-links">
                    <a onClick={this.props.showForgotpw} href="#forgot-password">Forgot Password?</a>
                    <a onClick={this.props.showSignup} href="#sign-up">Sign Up</a>
                </div>
            </div>
        )
    }
}

export default UserLoginForm;