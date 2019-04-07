/**
 * Player.js
 * Component for showing player details, does mobile and not mobile versions
 *      also does attendanceMode and not
 * Props:
 *  player_details - the player object to present
 *  attendanceMode - true/false, if we're in attendance mode
 * State:
 *  present - attendanceMode, if the player is actually present 
 * TODO: represent the player in state, so that we can ditch the callback stuff
 */
import React, { Component } from 'react';
import { Edit as Pencil } from '@material-ui/icons';
import { Switch } from '@material-ui/core';

class Player extends Component {

    state = { present: false }

    componentDidMount() {
        if (this.props.player_details.present === true) {
            this.setState({ present: true });
        }
    }

    //click handler, just toggles present variable
    togglePlayerPresent = () => {
        const { onChange, player_details } = this.props;
        this.setState(prevState => ({
            present: !prevState.present
        }))
        onChange(player_details, !player_details.present);
    } //end togglePlayerPresent

    //callback to roster for the edit button
    editPlayer = () => {
        const { onEditClick, player_details } = this.props;
        onEditClick(player_details);
    } //end editPlayer

    //take the string of numbers and make them prettier
    formatPhoneNumber = (phone_string) => {
        if (phone_string) {
            let phone_string_clean = phone_string.toString().replace(/\D/g, '');
            let matches = phone_string_clean.match(/(\d{3})(\d{3})(\d{4})$/);
            if (matches) {
                return '(' + matches[1] + ') ' + matches[2] + '-' + matches[3];
            }
        } else {
            return "";
        }
    } //end formatPhoneNumber


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
        const { player_details, attendanceMode } = this.props;
        const rendered_nick = (player_details.nickname) ? '"' + player_details.nickname + '"' : "";
        const active = this.state.present ? "active player-card" : "player-card";
        const default_image = "http://lorempixel.com/g/200/200/animals";
        const image_path = player_details.profile_image?player_details.profile_image:default_image;


        if (attendanceMode) {
            //attendanceMode
            return (
                <div className={active} onClick={this.togglePlayerPresent}>
                    <img className="profile-image" src={image_path} alt={player_details.first_name + " " + player_details.last_name + "'s avatar"} />
                    <div className="player-details">
                        <div className="player-name">{player_details.first_name} {rendered_nick} {player_details.last_name}</div>
                        <div className="list-view-phone">{this.formatPhoneNumber(player_details.phone)}</div>

                    </div>
                    <div className="toggle-button" >
                        <Switch
                            checked={this.state.present}
                            classes={{
                                switchBase: "switch-toggle-base",
                                checked: "switch-toggle-checked",
                                bar: "switch-toggle-bar",
                            }}
                        />
                    </div>

                    <div className="all-details">
                        <ul>
                            {/*<li>{player_details.first_name} {rendered_nick} {player_details.last_name}</li>*/}
                            <li>{this.formatPhoneNumber(player_details.phone)}</li>
                            <li><a href={image_path}>Profile Image</a></li>
                            <li>UGA: {player_details.uga_id}</li>
                            <li>USAU: {player_details.usau_id}</li>
                            <li><a href={"mailto:" + player_details.email}>{player_details.email}</a></li>
                            <li><a href={"mailto:" + player_details.uga_email}>{player_details.uga_email}</a></li>
                            {/* TODO: make the active thing prettier */}
                            <li>{player_details.active === 1 ? "Active" : "Not Active"}</li>
                        </ul>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={active}>
                    <img className="profile-image" src={image_path} alt={player_details.first_name + " " + player_details.last_name + "'s avatar"} />
                    <div className="player-details">
                        <div className="player-name">{player_details.first_name} {rendered_nick} {player_details.last_name}</div>
                        <div className="list-view-phone">{this.formatPhoneNumber(player_details.phone)}</div>

                    </div>
                    <div className="edit-button" >
                        <button onClick={this.editPlayer} className="btn hidden-desktop"><Pencil fontSize="small" className="inline-icon" /> Edit</button>
                    </div>
                    <div className="all-details">
                        <ul>
                            {/*<li>{player_details.first_name} {rendered_nick} {player_details.last_name}</li>*/}
                            <li>{this.formatPhoneNumber(player_details.phone)}</li>
                            <li><a href={image_path}>Profile Image</a></li>
                            <li>UGA: {player_details.uga_id}</li>
                            <li>USAU: {player_details.usau_id}</li>
                            <li><a href={"mailto:" + player_details.email}>{player_details.email}</a></li>
                            <li><a href={"mailto:" + player_details.uga_email}>{player_details.uga_email}</a></li>
                            <li>{player_details.active === 1 ? "Active" : "Not Active"}</li>
                        </ul>
                        <button onClick={this.editPlayer} className="btn btn-secondary"><Pencil fontSize="small" className="inline-icon" /> Edit</button>
                    </div>
                </div>
            )
        }
    }
}
export default Player;