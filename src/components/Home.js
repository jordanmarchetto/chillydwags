/**
 * Home.js
 * Landing page for the site; probably just a static image
 */
import React, { Component } from 'react';
import chillydawgs_logo from '../images/chillydawgs_logo.png';

class Home extends Component {
    render() {
        return (
            <main>
                <img src={chillydawgs_logo} height="150px" alt="Chillydwags logo" />
                <h2>Welcome, {this.props.user.name}</h2>
            </main>
        )
    }
}
export default Home;