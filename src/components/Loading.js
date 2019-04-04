/**
 * Loading.js
 * Simple component to just show the logo and potentially some text
 * Props:
 *  noSpinner - true/false
 *  text - text to be displayed below the logo in place of spinner
 */
import React, { Component } from 'react';
import '../css/loading.css';
import chillydawgs_logo from '../images/chillydawgs_logo.png';

class Loading extends Component {
    render() {
        return (
            <div className="loading-screen">
                <div className="loading-screen-content">
                    <img src={chillydawgs_logo} alt="Chillydawgs Logo" />
                </div>
                {this.props.noSpinner ?
                    <div><h2>{this.props.text}</h2></div> :
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div><div></div><div></div></div>
                }
            </div>
        )
    }
}
export default Loading;