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
import * as yup from 'yup';

let schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().email().required(),
})

class UserRegistrationForm extends Component {
    state = {validForm: true};

    handleChange = () => {
        console.log("verify form");
        //this.setState({validForm:!this.state.validForm})
    }

    render() {
        return (
            <div className="login-wrapper">
                <div className="login-form">
                <h2>Sign Up</h2>
                <TextField
                        name="name"
                        className="edit-field"
                        id="edit_name"
                        variant="outlined"
                        onChange={this.handleChange}
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
                        label="Name"
                    />
                    <TextField
                        name="email"
                        className="edit-field"
                        id="edit_email"
                        variant="outlined"
                        onChange={this.handleChange}
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
                        onChange={this.handleChange}
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
                        label="Password (Confirm)"
                    />
                    <button className="btn btn-submit" disabled={!this.state.validForm} >Submit <Send className="inline-icon submit-icon" /></button>
                </div>
                <div className="login-links">
                    <a onClick={this.props.showLogin} href="#login"><ChevronLeft className="inline-icon" fontSize="small" />Login</a>
                    <a onClick={this.props.showForgotpw} href="#forgot-pw">Forgot Password?</a>
                </div>
            </div>
        )
    }
}

export default UserRegistrationForm;