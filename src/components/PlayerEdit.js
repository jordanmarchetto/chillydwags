/**
 * PlayerEdit.js
 * Used to edit the players, is basically a modal with a form in it
 * Props:
 *  player_details - player object passed in from roster
 *  onSave - callback for when we click save
 *  onClose - callback for when we click close
 * State:
 *  modalIsOpen - true/false, if modal is showing
 *  edit_player - temporary player object for the player we're working with, is a copy of what's passed in via props
 */
import React, { Component } from 'react';
import Modal from 'react-modal';
import { TextField, Radio, RadioGroup, FormGroup, FormLabel, FormControlLabel, FormControl } from '@material-ui/core';
import { Edit as Pencil } from '@material-ui/icons';
import * as yup from 'yup';

Modal.setAppElement('#react-container')

class PlayerEdit extends Component {
    constructor(props) {
        super(props);

        //make a deep copy of the props player to store in state
        //while not the best practice, this works as a way to store changes while
        //  editing, and then delete them if we close the modal without saving
        let newP = Object.assign({}, props.player_details);

        //create a data schema to use for form validation
        let schema = yup.object().shape({
            first_name: yup.string().required(),
            last_name: yup.string(),
            nickname: yup.string(),
            usau_id: yup.number(),
            uga_id: yup.number(),
            email: yup.string().email().required(),
            uga_email: yup.string().email(),
            phone: yup.string(),
            profile_image: yup.string().url(),
            active: yup.number(),
        })

        this.state = {
            modalIsOpen: true,
            errors: {},
            schema: schema,
            edit_player: newP
        };

        //bind stuff per the modal library
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
        const { onClose } = this.props;
        onClose();
    }

    componentDidMount() {
        //consider doing the API call here to make sure we have the latest data
        //the problem is that slows everything down (more api calls)
    }

    //take the string of numbers and make them prettier
    formatPhoneNumber = (phone_string) => {
        let phone_string_clean = phone_string.toString().replace(/\D/g, '');
        let matches = phone_string_clean.match(/(\d{3})(\d{3})(\d{4})$/);
        if (matches) {
            return '(' + matches[1] + ') ' + matches[2] + '-' + matches[3];
        }
        return null;
    } //end formatPhoneNumber

    //handles changes to text inputs
    //this is called on all form elements
    //when the event is triggered, we snag the key/val and push to our temp player
    //then call form validate function
    //TODO: consider dynamically reformatting phone number here
    handleChange = async (event) => {
        //copy the obj, then update the value per the triggered event
        let key = event.target.name;
        let val = event.target.value;
        let newP = this.state.edit_player;

        //check for 'active' since it's a 1/0 value
        if (key === "active") {
            val = parseInt(val);
        }
        newP[key] = val;


        //push change to state and re-validate form
        this.setState({ edit_player: newP }, this.validateForm);


    } //end handleChange

    //do the form validation
    //show errors in the appropriate place
    //returns true/false if the form is valid
    validateForm = async () => {
        let result = false;

        const error_div = document.getElementById("error-text");
        const { edit_player, schema } = this.state;
        let error_list = {};

        //run validation, push errors where they go
        await schema.validate(edit_player, { abortEarly: false }).then(function (value) {
            //no errors, we're valid now
            error_div.innerHTML = "";
            result = true;
        }).catch(function (err) {
            error_div.innerHTML = "<ul>";
            for (var i = 0; i < err.errors.length; i++) {
                error_div.innerHTML += "<li>" + err.errors[i] + "</li>";
                error_list[err.inner[i].path] = true;
            }
            error_div.innerHTML += "</ul>";
        });

        //update the state
        this.setState({ errors: error_list });
        return result;
    } //end validateForm

    //called when we click save
    //we should revalidate the form and decide whether or not to call the roster callback
    updatePlayer = async () => {
        const { onSave } = this.props;
        const { edit_player } = this.state;
        //we're using the state player, otherwise, we'd pull the form data:
        //const data = new FormData(document.getElementById("player-edit"));

        if (await this.validateForm()) {
            //form is valid
            //close the modal and do the callback to the roster
            this.closeModal();
            onSave(edit_player);
        } else {
            //form was invalid
            //we should never hit this state because the form shouldn't be
            // submitable if it's invalid
            console.log("Error: Invalid form submitted");
        }


    } //end updatePlayer


    //wrapper for form submission
    //mostly so we can use the enter key to submit
    submitForm = () => {
        this.updatePlayer();
    } //end submitForm

    //{ "id": 1, "created_at": "2019-03-22 12:23:28", "updated_at": "2019-03-22 12:23:28"
    // "first_name": "Robby"
    // "last_name": "Roos"
    // "nickname": "Dooley"
    // "phone": "+1-443-775-5095"
    // "email": "jermain.oconnell@upton.com"
    // "uga_email": "hyatt.marcelino@grant.net"
    // "profile_image": "hyatt.marcelino@grant.net"
    // "usau_id": 4485966641374291
    // "uga_id": 4929999703282791
    // "active": 1 }, 
    render() {
        const player_details = this.state.edit_player;
        const errors = this.state.errors;
        const nicer_nick = (player_details.nickname) ? '"' + player_details.nickname + '"' : "";
        const disabled = (Object.keys(errors).length > 0) ? true : false;


        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                contentLabel="Edit Player"
                className="player-edit-modal"
                overlayClassName="player-edit-modal-overlay"
            >
                <div className="player-edit-modal-content" >

                    <div className="header">
                        <h2>{player_details.first_name} {nicer_nick} {player_details.last_name}</h2>
                    </div>
                    <div className="body">
                        <div className="edit-player-body-wrapper">
                            <div className="edit-player-image">
                                <div className="edit-image-wrapper">
                                    <img className="profile-image" src={player_details.profile_image} alt={player_details.first_name + " " + player_details.last_name + "'s avatar"} />
                                    <div className="edit-image-button"><Pencil fontSize="small" className="inline-icon" /> Edit</div>
                                </div>
                                <p id="error-text" className="error-text"></p>
                            </div>
                            <div className="form-fields-wrapper">
                                <form id="player-edit" onSubmit={disabled ? null : this.submitForm} method="POST">
                                    {disabled ? "" : <input type="submit" className="hidden" tabIndex="-1" />}
                                    <TextField
                                        error={errors.first_name}
                                        name="first_name"
                                        className="edit-field"
                                        onChange={this.handleChange}
                                        defaultValue={player_details.first_name}
                                        id="edit_first_name"
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
                                        variant="outlined"
                                        label="First Name"
                                    />
                                    <TextField
                                        name="nickname"
                                        className="edit-field"
                                        error={errors.nickname}
                                        onChange={this.handleChange}
                                        defaultValue={player_details.nickname}
                                        id="edit_nickname"
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
                                        label="Nickname"
                                    />
                                    <TextField
                                        name="last_name"
                                        error={errors.last_name}
                                        className="edit-field"
                                        onChange={this.handleChange}
                                        defaultValue={player_details.last_name}
                                        id="edit_last_name"
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
                                        label="Last Name"
                                    />
                                    {/*
                                    TODO: allow for image upload?
                                    <TextField
                                        name="profile_image"
                                        className="edit-field"
                                        onChange={this.handleChange}
                                        defaultValue={player_details.profile_image}
                                        id="edit_profile_image"
                                        variant="outlined"
                                        label="Profile Image"
                                    />
                                    */}
                                    <TextField
                                        name="phone"
                                        error={errors.phone}
                                        className="edit-field"
                                        onChange={this.handleChange}
                                        defaultValue={player_details.phone}
                                        id="edit_phone"
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
                                        label="Phone"
                                    />
                                    <TextField
                                        error={errors.email}
                                        name="email"
                                        className="edit-field"
                                        onChange={this.handleChange}
                                        defaultValue={player_details.email}
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
                                        name="uga_email"
                                        error={errors.uga_email}
                                        className="edit-field"
                                        onChange={this.handleChange}
                                        defaultValue={player_details.uga_email}
                                        id="edit_uga_email"
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
                                        label="UGA Email"
                                    />
                                    <TextField
                                        name="uga_id"
                                        error={errors.uga_id}
                                        className="edit-field"
                                        onChange={this.handleChange}
                                        defaultValue={player_details.uga_id}
                                        id="edit_uga_id"
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
                                        label="UGA ID"
                                    />
                                    <TextField
                                        name="usau_id"
                                        error={errors.usau_id}
                                        className="edit-field"
                                        onChange={this.handleChange}
                                        defaultValue={player_details.usau_id}
                                        id="edit_usau_id"
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
                                        label="USAU ID"
                                    />
                                    {/*
                                    <TextField
                                        name="active"
                                        className="edit-field"
                                        onChange={this.handleChange}
                                        defaultValue={player_details.active}
                                        id="edit_active"
                                        variant="outlined"
                                        label="Active"
                                    />*/}

                                    {/*https://material-ui.com/demos/selection-controls/*/}
                                    {/*https://codesandbox.io/s/7wyylw45q1*/}
                                    <FormGroup row={true}>
                                        <FormControl component="fieldset" fullWidth={true}>
                                            <FormLabel component="legend">Active Player</FormLabel>
                                            <RadioGroup
                                                aria-label="Active Player"
                                                name="active_player"
                                                className="inline-radio-group"
                                            >
                                                <FormControlLabel
                                                    value="1"
                                                    id="edit_active"
                                                    control={
                                                        <Radio
                                                            checked={player_details.active === 1 ? true : false}
                                                            classes={{
                                                                checked: "radio-checked",
                                                            }}
                                                            onChange={this.handleChange}
                                                            name="active"
                                                        />
                                                    } label="Yes" />
                                                <FormControlLabel
                                                    value="0"
                                                    control={
                                                        <Radio
                                                            checked={player_details.active === 0 ? true : false}
                                                            onChange={this.handleChange}
                                                            classes={{
                                                                checked: "radio-checked",
                                                            }}
                                                            name="active"
                                                        />
                                                    } label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </FormGroup>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="footer-wrapper">
                            <button onClick={this.submitForm} className="modal-button submit" disabled={disabled}>Save</button>
                            <button onClick={this.closeModal} className="modal-button cancel">Close</button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}
export default PlayerEdit;