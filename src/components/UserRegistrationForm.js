/**
 * UserRegistrationForm.js
 * Form for signing up a new user
 * Functions very similar to PlayerEdit.js (and UserLoginForm.js)
 */
import React, { Component } from 'react';
import { TextField, CircularProgress } from '@material-ui/core';
import { Send, ChevronLeft } from '@material-ui/icons';
import * as yup from 'yup';
import sha256 from 'crypto-js/sha256';
import { Link } from 'react-router-dom'




class UserRegistrationForm extends Component {
    constructor(props) {
        super(props);
        let schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().required(),
        })
        this.state = { validForm: true, formValues: {}, errors: {}, schema: schema, api_error: null, loading: false, success: null };
    }

    //simple change handler for form fields, just updates the state
    handleChange = (event) => {
        let key = event.target.name;
        let val = event.target.value;
        let formValues = this.state.formValues;
        formValues[key] = val;
        this.setState({ formValues: formValues }, this.validateForm);
    } //end handleChange

    //validates the form and updates the state with errors
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

        if (formValues.password !== formValues.password_confirm) {
            error_list.password = true;
            error_list.password_confirm = true;
            error_list.passwords_not_matching = true;
            result = false;
        }

        //update the state
        this.setState({ errors: error_list, validForm: result });
        return result;
    }


    //handles form submission
    submitForm = async (e) => {
        e.preventDefault();
        if (await this.validateForm()) {
            let { formValues } = this.state;
            let pw = sha256(process.env.REACT_APP_SALT + formValues.password).toString();

            formValues.password = pw;
            formValues.password_confirmation = pw;
            formValues.type = "chillydwag";

            this.setState({ loading: true });

            await fetch(process.env.REACT_APP_AUTH_API_URL + "/signup", {
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
                    //console.log("Result:")
                    //console.log(result);
                },
                (error) => {
                    //console.log("Fetch failed.");
                    //console.log(error);
                    this.setState({ api_error: "Could not create account. Sorry." });
                }
            );

            this.setState({ loading: false, success: true });

            //call the callback
            this.props.submitForm();
        }
    } //end submitForm

    render() {
        const { api_error, validForm, formValues, errors, loading, success } = this.state;

        const disabled = (!validForm || loading);
        if (api_error) {
            return (
                <div className="login-wrapper">
                    <h2>Sign Up</h2>
                    <div className="login-form error-text">{api_error}</div>
                </div>
            )

        } else {
            return (
                <div className="login-wrapper">
                    <div className="login-form">
                        <h2>Sign Up</h2>
                        {success ?
                            <div className="login-form success-text">
                                <p>
                                    Account successfully created!
                                </p>
                            </div>
                            :
                            <form id="register" onSubmit={disabled ? null : this.submitForm} method="POST">
                                {!validForm ? "" : <input type="submit" className="hidden" tabIndex="-1" />}
                                <TextField
                                    name="name"
                                    className="edit-field"
                                    id="edit_name"
                                    variant="outlined"
                                    error={errors.name}
                                    onChange={this.handleChange}
                                    defaultValue={formValues.name}
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
                                <TextField
                                    name="password_confirm"
                                    className="edit-field"
                                    id="edit_password_confirm"
                                    variant="outlined"
                                    type="password"
                                    error={errors.password_confirm}
                                    onChange={this.handleChange}
                                    defaultValue={formValues.password_confirm}
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
                                    label={errors.passwords_not_matching ? "Password (must match above)" : "Password (Confirm)"}
                                />
                                <button className="btn btn-submit" disabled={disabled} onClick={this.submitForm}>Submit
                            {loading ?
                                        <CircularProgress className="loading-spinner" />
                                        :
                                        <Send className="inline-icon submit-icon" />
                                    }
                                </button>
                            </form>
                        }
                    </div>
                    <div className="login-links">
                        <Link to='/login'><ChevronLeft className="inline-icon" fontSize="small" />Login</Link>
                        {/*<Link to='/forgot-password'>Forgot Password?</Link>*/}
                    </div>
                </div>
            )
        }
    }
}

export default UserRegistrationForm;