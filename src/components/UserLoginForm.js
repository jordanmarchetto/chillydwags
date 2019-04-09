/**
 * UserLoginForm.js
 * Simple component to just show the logo and potentially some text
 * Props:
 *  noSpinner - true/false
 *  text - text to be displayed below the logo in place of spinner
 */
import React, { Component } from 'react';
import * as yup from 'yup';
import sha256 from 'crypto-js/sha256';
import { TextField, CircularProgress } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { Link } from 'react-router-dom'

class UserLoginForm extends Component {
    constructor(props) {
        super(props);
        let schema = yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().required(),
        })
        this.state = { validForm: true, formValues: {}, errors: {}, schema: schema, api_error: null, loading: false  };
    }


    handleChange = (event) => {
        let key = event.target.name;
        let val = event.target.value;
        let formValues = this.state.formValues;
        formValues[key] = val;
        this.setState({ formValues: formValues }, this.validateForm);
        //this.setState({validForm:!this.state.validForm})

    }

    validateForm = async () => {
        let result = false;
        const { formValues, schema } = this.state;
        let error_list = {};

        //run validation, push errors where they go
        await schema.validate(formValues, { abortEarly: false }).then(function (value) {
            //no errors, we're valid now
            result = true;
        }).catch(function (err) {
            for (var i = 0; i < err.errors.length; i++) {
                error_list[err.inner[i].path] = true;
            }
        });


        //update the state
        await this.setState({ errors: error_list, validForm: result, api_error:null });
        return result;
    }


    submitForm = async (e) => {
        e.preventDefault();
        if (await this.validateForm()) {
            let { formValues } = this.state;
            let pw = sha256(process.env.REACT_APP_SALT + formValues.password).toString();

            formValues.password = pw;
            formValues.remember_me = true;

            this.setState({ loading: true });

            await fetch(process.env.REACT_APP_AUTH_API_URL + "/login", {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    formValues
                )
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            }).then(
                (result) => {
                    this.setState({ loading: false, success: true });
                    //call the callback
                    this.props.submitForm(result);

                },
                (error) => {
                    console.log("Fetch failed.");
                    console.log(error);
                    this.setState({ api_error: "Invalid credentials.", loading: false });
                }
            );



        }
    }

    render() {
        const { api_error, validForm, formValues, errors, loading } = this.state;
        const disabled = (!validForm || loading);
        return (
            <div className="login-wrapper">
                <div className="login-form">
                    <h2>Log In</h2>
                    {api_error ?
                        <div className="login-form error-text"><p>{api_error}</p></div>
                        : ''}
                    <TextField
                        name="email"
                        className="edit-field"
                        error={errors.email}
                        id="edit_email"
                        variant="outlined"
                        onChange={this.handleChange}
                        defaultValue={formValues.email}
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
                        type="password"
                        error={errors.password}
                        onChange={this.handleChange}
                        defaultValue={formValues.password}
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
                    <button className="btn btn-submit" disabled={disabled} onClick={this.submitForm}>Submit
                            {loading ?
                            <CircularProgress className="loading-spinner" />
                            :
                            <Send className="inline-icon submit-icon" />
                        }
                    </button>
                </div>
                <div className="login-links">
                    <Link to='/forgot-password'>Forgot Password?</Link>
                    <Link to='/signup'>Sign Up</Link>
                </div>
            </div>
        )
    }
}

export default UserLoginForm;