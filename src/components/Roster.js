/**
 * Roster.js
 * Largest piece of the site, handles api calls to server, pulls in all the player cards, etc
 * Props:
 *  verbose - true/false, just decides if we should print stuff in the console as we go
 *  attendanceMode - true/false, if true, the roster loads in attendance mode, allowing for taking attendance, 
 *          otherwise the roster is in view/edit mode
 *  dummy_players - placeholder data that should be used if getting the roster fails (for testing purposes)
 * 
 * State:
 *  error - if there's an error with api call
 *  isLoaded - true/false, whether or not we've loaded the roster
 *  players - working set of data for players
 *  editPlayerId - id of the player we're actively editing
 *  present_players - when in attendance mode, tracks who's here
 *  total_players - when in attendance mode, tracks total # of players
 */
import React, { Component } from 'react';
import Player from './Player';
import PlayerEdit from './PlayerEdit';
import Loading from './Loading';
import { AddCircleOutline } from '@material-ui/icons';
import Cookies from 'universal-cookie';

class Roster extends Component {

    static defaultProps = {
        version: "None",
        verbose: false,
        attendanceMode: false,
        dummy_players: [
            { "id": 1, "present": true, "profile_image": "https://lorempixel.com/100/100/cats/?53695", "created_at": "2019-03-22 12:23:28", "updated_at": "2019-03-22 12:23:28", "first_name": "Robby", "last_name": "Roos", "nickname": "Dooley", "phone": "+1-443-775-5095", "email": "robby.oconnell@upton.com", "uga_email": "hyatt.marcelino@grant.net", "usau_id": 4485966641374291, "uga_id": 4929999703282791, "active": 1 },
            { "id": 2, "profile_image": "https://lorempixel.com/100/100/cats/?53695", "created_at": "2019-03-22 12:23:28", "updated_at": "2019-03-22 12:23:28", "first_name": "Dallas", "last_name": "Funk", "nickname": "Rodriguez", "phone": "+1 (740) 202-0349", "email": "amanda72@gmail.com", "uga_email": "lbrown@yahoo.com", "usau_id": 4532948923569965, "uga_id": 375867186814645, "active": 1 },
            { "id": 3, "profile_image": "https://lorempixel.com/100/100/cats/?53695", "created_at": "2019-03-22 12:23:28", "updated_at": "2019-03-22 12:23:28", "first_name": "Nikita", "last_name": "Abbott", "nickname": "Mann", "phone": "1-373-792-9129 x856", "email": "rosenbaum.faye@greenfelder.com", "uga_email": "dayna.homenick@gmail.com", "usau_id": 6011650589748256, "uga_id": 4716027990749251, "active": 1 },
            { "id": 4, "profile_image": "https://lorempixel.com/100/100/cats/?53695", "created_at": "2019-03-22 12:23:28", "updated_at": "2019-03-22 12:23:28", "first_name": "Elaina", "last_name": "Smith", "nickname": "Purdy", "phone": "+1-320-272-9424", "email": "ufranecki@sanford.com", "uga_email": "kirlin.flossie@gmail.com", "usau_id": 4485974161013505, "uga_id": 2368575229501864, "active": 1 },
            { "id": 5, "profile_image": "https://lorempixel.com/100/100/cats/?53695", "created_at": "2019-03-22 12:23:28", "updated_at": "2019-03-22 12:23:28", "first_name": "Sheldon", "last_name": "Crona", "nickname": "Champlin", "phone": "(325) 555-3355 x3894", "email": "juston88@gmail.com", "uga_email": "kaleb.fritsch@davis.com", "usau_id": 2720023159840591, "uga_id": 6011617604854690, "active": 1 },
            { "id": 6, "present": true, "profile_image": "https://lorempixel.com/100/100/cats/?53695", "created_at": "2019-03-22 12:23:28", "updated_at": "2019-03-22 12:23:28", "first_name": "Axel", "last_name": "Waelchi", "nickname": "Wiegand", "phone": "+12729839388", "email": "norwood.herman@walsh.com", "uga_email": "maddison99@beatty.org", "usau_id": 4716587810669724, "uga_id": 4485620593391, "active": 1 }
        ]
    }

    state = {
        error: null,
        isLoaded: false,
        players: [],
        editPlayerId: null,
        addingNewPlayer: false,
        present_players: null,
        attendance_saved: false,
        total_players: null
    }

    componentDidMount() {
        //pull current players from the server
        const cookies = new Cookies();
        let token = cookies.get("token");
        fetch(process.env.REACT_APP_API_URL + "/players", {
            headers: {
                'Authorization': 'Bearer ' + token.access_token,
              }
        })
            .then(response => {
                if (this.props.verbose) {
                    console.log("Fetch of 'https://api.jmar.dev/chillydwags/players' completed.")
                }
                if (response.ok) {
                    if (this.props.verbose) {
                        console.log("Response:")
                        console.log(response.clone().json());
                    }
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(
                (result) => {
                    if (this.props.verbose) {
                        console.log("Result:")
                        console.log(result);
                    }
                    this.setState({
                        isLoaded: true,
                        players: result
                    });
                    this.setRoster();
                },
                (error) => {
                    console.log(error);
                    if (this.props.verbose) {
                        console.log("Fetch failed.");
                    }
                    this.setState({
                        isLoaded: true,
                        //commenting the next line out will prevent the error from being thrown
                        //but then in the render, it's not going to use the default array, it's just gonna throw the error
                        //need to update the render to ALLOW an error, and still render.
                        error
                    });
                    this.setRoster();
                }
            )
    } //end componentDidMount

    //this is called after we try to pull down the players
    //if the api call fails, this is what loads up the dummy data
    setRoster = () => {
        const { players } = this.state;
        const { dummy_players } = this.props;

        //roster switching code
        let roster = []
        let use_test_data = false;
        if (players.length <= 0 || use_test_data) {
            if (this.props.verbose) {
                console.log("Using test data players.")
            }
            roster = dummy_players;
        } else {
            if (this.props.verbose) {
                console.log("Using fetched players.")
            }
            roster = players;
        }

        //store the roster in the state
        this.setState({ players: roster });
        this.calculateSprints();
    } //end setRoster

    //whenever a player is toggled here/not here, we update the roster
    updateRoster = (player_details, present) => {
        if (this.props.verbose) {
            console.log("Updating roster");
        }
        this.state.players.forEach(function (player) {
            if (player.id === player_details.id) {
                player.present = present;
            }
        });
        this.calculateSprints();
    } //end updateRoster

    //callback for edit button in <Player> 
    //sets the state for which player we're editing
    handleEditClick = (player_details) => {
        if (this.props.verbose) {
            console.log("Editing Player: " + player_details.id);
        }
        this.setState({ editPlayerId: player_details.id });
    } //end handleEditClick


    //callback for when we click delete in <PlayerEdit>
    deletePlayer = async (player_details) => {
        if (this.props.verbose) {
                console.log("Deleting Player: " + player_details.id);
        }

        let post_url = process.env.REACT_APP_API_URL + "/players" + player_details.id;
        const cookies = new Cookies();
        let token = cookies.get("token");

        fetch(post_url, {
            method: 'Delete',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.access_token,
            },
            body: JSON.stringify(
                player_details
            )
        }).then(response => {
            //we don't really care about the response
            if (this.props.verbose) {
                console.log("Successfully DELETE'd on server");
            }
        }).catch(error => {
            if (this.props.verbose) {
                console.log("Error saving player to server");
                console.log(error);

            }
            this.setState({
                error
            });
        })


        //loop through players and add ones that weren't deleted
        //  back to our temporary array
        let updated_players = [];
        this.state.players.forEach(function (player, i) {
            if (player.id !== player_details.id) {
                updated_players.push(player);
            }
        });

        //update the state's player list to our new one
        this.setState({ editPlayerId: null, players: updated_players });
    } //end deletePlayer

    //callback for the save button in <PlayerEdit>
    // only called when we're adding a new player
    //actually saves the player data to the server
    //the player object _should_ be valid at this point
    addPlayer = async (player_details) => {
        if (this.props.verbose) {
            console.log("Adding Player, full data:");
            console.log(player_details);
        }
            console.log("body:");
            console.log(JSON.stringify(player_details));

            this.setState({ isLoaded: false });
            let post_url = process.env.REACT_APP_API_URL + "/players";
            let updated_players = [...this.state.players];
            const cookies = new Cookies();
            let token = cookies.get("token");
    
            await fetch(post_url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token.access_token,
                },
                body: JSON.stringify(
                    player_details
                )
            }).then(response => {
                if (response.ok) {
                    if (this.props.verbose) {
                        console.log("Response:")
                        console.log(response.clone().json());
                    }
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            }).then((result) => {

                if (this.props.verbose) {
                    console.log("Really Successfully POST to server");
                    console.log(result);
                }
                //make a copy of the current player list
                updated_players.push(result);

            }).catch(error => {
                if (this.props.verbose) {
                    console.log("Error saving player to server");
                    console.log(error);

                }
                this.setState({
                    error: true
                });
            })
            if (this.props.verbose) {
                console.log("Updating the state:");
                console.log(this.state);
            }

            //update the state's player list to our new one
            this.setState({ editPlayerId: null, players: updated_players, addingNewPlayer: false, isLoaded:true });
            console.log(this.state);
    } //end addPlayer

    //callback for the save button in <PlayerEdit>
    //actually saves the player data to the server
    //the player object _should_ be valid at this point
    savePlayer = (player_details) => {
        if (this.props.verbose) {
            console.log("Saving Player, full data:");
            console.log(player_details);
        }
            let post_url = process.env.REACT_APP_API_URL + "/players/" + player_details.id;
            const cookies = new Cookies();
            let token = cookies.get("token");
    
            fetch(post_url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token.access_token,
                },
                body: JSON.stringify(
                    player_details
                )
            }).then(response => {
                //we don't really care about the response
                if (this.props.verbose) {
                    console.log("Successfully PUT to server");
                }
            }).catch(error => {
                if (this.props.verbose) {
                    console.log("Error saving player to server");
                    console.log(error);

                }
                this.setState({
                    error
                });
            })

            //make a copy of the current player list
            let updated_players = [...this.state.players];

            //find the matching player
            this.state.players.forEach(function (player, i) {
                if (player.id === player_details.id) {
                    updated_players[i] = player_details;
                }
            });

            //update the state's player list to our new one
            this.setState({ editPlayerId: null, players: updated_players });
    } //end savePlayer

    //open the 'new player' window
    newPlayer = () => {
        this.setState({ addingNewPlayer: true });
    } //end newPlayer

    //callback for <PlayerEdit> to close the modal
    closePlayer = () => {
        //closing the player dialog/doing nothing with the changes
        this.setState({ editPlayerId: null, addingNewPlayer: false });
    } //end closePlayer

    //triggered by save button
    saveAttendance = () => {
        console.log("saving ...");
        //console.log(this.state.players);

        //streamlined_players = this.state.players;
        let streamlined_players = Array();
        this.state.players.forEach(function (player) {
            let templayer = {
                'id': player.id,
                'first_name': player.first_name,
                'last_name': player.last_name,
                'present': (player.present)?'true':'false'
            }
            streamlined_players.push(templayer);
        });

        let attendance_record = {
            "recorded_by": "1",
            "timestamp": "133",
            "notes": "asdfl",
            "attendance": streamlined_players
        }

        console.log(attendance_record);

        let post_url = process.env.REACT_APP_API_URL + "/attendance";
        const cookies = new Cookies();
        let token = cookies.get("token");

        fetch(post_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token.access_token,
            },
            body: JSON.stringify(attendance_record)
        }).then(response => {
            if (response.ok) {
                if (this.props.verbose) {
                    console.log("Response:")
                    console.log(response.clone().json());
                }
                return response.json();
            } else {
                throw new Error('Something went wrong ...');
            }
        }).then((result) => {

            if (this.props.verbose) {
                console.log("Really Successfully POST to server");
                console.log(result);
            }
            //push a change to the UI here
            this.setState({attendance_saved: true});

        }).catch(error => {
            if (this.props.verbose) {
                console.log("Error saving attendance to server");
                console.log(error);

            }
            this.setState({
                error: true
            });
        })


    } //end saveAttendance

    //used in attendance mode to calculate the number of sprints owed
    calculateSprints = () => {
        if (this.props.verbose) {
            console.log("Calculating sprints");
        }

        let pp = 0;
        let tp = 0;
        this.state.players.forEach(function (player) {
            tp++;
            if (player.present === true) {
                pp++;
            }
        });
        this.setState({ present_players: pp, total_players: tp });
    } //end calculateSprints


    render() {
        const { error, isLoaded, players, total_players, present_players, editPlayerId, addingNewPlayer, attendance_saved } = this.state;
        const attendanceMode = this.props.takeAttendance;

        if (error) {
            //Show error from api fail
            return <div>{error}</div>
        } else if (!isLoaded) {
            //Loading screen, cause we can
            return <Loading />
        } else {
            if (this.props.verbose) {
                console.log("Populating roster's html.")
                console.log(players);
            }

            if (attendanceMode) {
                //attendance mode
                let sprints_owed = total_players - present_players;
                let dateString = new Date().toLocaleString();
                return (
                    <div className="roster-page take-attendance">
                        <p className="date">{dateString}</p>
                        <p>{present_players} of {total_players} players present.  {sprints_owed} sprints owed.</p>
                        <div className="player-list">
                            {players.map(item => (
                                <Player
                                    key={item.id}
                                    player_details={item}
                                    onChange={this.updateRoster}
                                    attendanceMode={true}
                                />
                            ))}
                        </div>
                        <div style={{paddingTop: '10px'}}>
                            <a className="btn" onClick={this.saveAttendance}>Save</a>
                            {attendance_saved ?
                                <span>Saved.</span> : <span></span>
                            }
                        </div>
                    </div>
                )
            } else {
                //not attendance mode
                return (
                    <div className="roster-page view-edit">
                        <div className="player-list">
                            {players.map(item => (
                                <Player
                                    key={item.id}
                                    player_details={item}
                                    onEditClick={this.handleEditClick}
                                />
                            ))}
                            <div className="player-card add-player-card">
                                <button onClick={this.newPlayer} className="btn hidden-desktop"><AddCircleOutline fontSize="small" className="inline-icon" /> Add Player</button>
                                <button onClick={this.newPlayer} className="add-button hidden-mobile">
                                    <AddCircleOutline fontSize="large" classes={{ root: "giant-icon" }} className="inline-icon" />
                                </button>
                            </div>
                        </div>
                        <div className="player-modals">
                            {players.map(item => (
                                item.id === editPlayerId ? (
                                    <PlayerEdit
                                        key={item.id}
                                        player_details={item}
                                        onSave={this.savePlayer}
                                        onClose={this.closePlayer}
                                        onDelete={this.deletePlayer}
                                    />
                                ) : (null)

                            ))}
                            {addingNewPlayer ?
                                <PlayerEdit
                                    newPlayer={true}
                                    onSave={this.addPlayer}
                                    onClose={this.closePlayer}
                                />
                                : ''}
                        </div>

                    </div>
                )

            }
        }
    }
}
export default Roster;