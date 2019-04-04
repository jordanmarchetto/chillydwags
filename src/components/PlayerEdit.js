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
import { TextField, Radio, RadioGroup, FormLabel, FormControlLabel, FormControl } from '@material-ui/core';
import * as yup from 'yup';

Modal.setAppElement('#react-container')

class PlayerEdit extends Component {
    constructor(props) {
        super(props);

        //make a deep copy of the props player to store in state
        //while not the best practice, this works as a way to store changes while
        //  editing, and then delete them if we close the modal without saving
        let newP = Object.assign({}, props.player_details);
        this.state = {
            modalIsOpen: true,
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
    handleChange = (event) => {
        //copy the obj, then update the value per the triggered event
        let key = event.target.name;
        let val = event.target.value;
        let newP = this.state.edit_player;
        newP[key] = val;

        //push change to state and re-validate form
        this.setState({ edit_player: newP }, this.validateForm);
    } //end handleChange

    //do the form validation
    //show errors in the appropriate place
    //returns true/false if the form is valid
    validateForm = () => {
        let result = false;

        //data schema to validate against
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
            //active: yup.number(),
        })

        let error_div = document.getElementById("error-text");
        const edit_player = this.state.edit_player;

        //run validation, push errors where they go
        schema.validate(edit_player, { abortEarly: false }).then(function (value) {
            //no errors, we're valid now
            error_div.innerHTML = "";
        }).catch(function (err) {
            error_div.innerHTML = "<ul>";
            for (var i = 0; i < err.errors.length; i++) {
                console.log("i: " + i + ", e: " + err.errors[i]);
                error_div.innerHTML += "<li>" + err.errors[i] + "</li>";
            }
            error_div.innerHTML += "</ul>";
        });

        return result;
    } //end validateForm

    //called when we click save
    //we should revalidate the form and decide whether or not to call the roster callback
    updatePlayer = () => {
        const { onSave } = this.props;
        const { edit_player } = this.state;
        //we're using the state player, otherwise, we'd pull the form data:
        //const data = new FormData(document.getElementById("player-edit"));

        if (this.validateForm()) {
            console.log("updatePlayer valid form");
        } else {
            console.log("updatePlayer INVALID form");
        }

        //the rest of this should be conditional:
        this.closeModal();

        console.log("player after");
        console.log(edit_player);
        onSave(edit_player);
    } //end updatePlayer


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
        const nicer_nick = (player_details.nickname) ? '"' + player_details.nickname + '"' : "";

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
                        <p id="error-text" className="error-text"></p>
                        <form id="player-edit">
                            <TextField
                                name="first_name" onChange={this.handleChange} defaultValue={player_details.first_name} id="edit_first_name" variant="outlined" label="First Name"
                            />
                            <TextField
                                name="nickname" onChange={this.handleChange} defaultValue={player_details.nickname} id="edit_nickname" variant="outlined" label="Nickname"
                            />
                            <TextField
                                name="last_name" onChange={this.handleChange} defaultValue={player_details.last_name} id="edit_last_name" variant="outlined" label="Last Name"
                            />
                            <TextField
                                name="profile_image" onChange={this.handleChange} defaultValue={player_details.profile_image} id="edit_profile_image" variant="outlined" label="Profile Image"
                            />
                            <TextField
                                name="phone" onChange={this.handleChange} defaultValue={player_details.phone} id="edit_phone" variant="outlined" label="Phone"
                            />
                            <TextField
                                name="email" onChange={this.handleChange} defaultValue={player_details.email} id="edit_email" variant="outlined" label="Email"
                            />
                            <TextField
                                name="uga_email" onChange={this.handleChange} defaultValue={player_details.uga_email} id="edit_uga_email" variant="outlined" label="UGA Email"
                            />
                            <TextField
                                name="uga_id" onChange={this.handleChange} defaultValue={player_details.uga_id} id="edit_uga_id" variant="outlined" label="UGA ID"
                            />
                            <TextField
                                name="usau_id" onChange={this.handleChange} defaultValue={player_details.usau_id} id="edit_usau_id" variant="outlined" label="USAU ID"
                            />
                            <TextField
                                name="active" onChange={this.handleChange} defaultValue={player_details.active} id="edit_active" variant="outlined" label="Active"
                            />

                            {/*https://material-ui.com/demos/selection-controls/*/}
                            {/*https://codesandbox.io/s/7wyylw45q1*/}
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup
                                    aria-label="Gender"
                                    name="gender1"
                                >
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />

                                </RadioGroup>
                            </FormControl>

                        </form>
                    </div>
                    <div className="footer">
                        <button onClick={this.updatePlayer} className="btn btn-secondary">Save</button>
                        <button onClick={this.closeModal} className="btn btn-secondary">Close</button>
                    </div>


                </div>
            </Modal>
        )
    }
}
export default PlayerEdit;