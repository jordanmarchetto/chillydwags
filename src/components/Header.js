/**
 * Header.js
 * Sitewide header; includes the burger menu and navigation links
 */
import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            menuOpen: false
        }
    }

    handleStateChange(state) {
        this.setState({ menuOpen: state.isOpen })
    }

    closeMenu() {
        this.setState({ menuOpen: false })
    }

    toggleMenu() {
        this.setState({ menuOpen: !this.state.menuOpen })
    }

    //calls the logoutHandler from App.js
    doLogout = () => {
        this.setState({ menuOpen: false })
        this.props.logoutHandler();
    }
    render() {
        const {user} = this.props;
        
        //https://negomi.github.io/react-burger-menu/
        return (
            <header>
                <div className="fake-background"> </div>
                <Menu
                    isOpen={this.state.menuOpen}
                    onStateChange={(state) => this.handleStateChange(state)}
                    activeClassName="active"
                    className="menu-toggle"
                >
                    <NavLink activeClassName="active" to="/dashboard" className="menu-btn" onClick={() => this.closeMenu()}>Home</NavLink>
                    <NavLink activeClassName="active" to="/roster" className="menu-btn" onClick={() => this.closeMenu()}>Roster</NavLink>
                    <NavLink activeClassName="active" to="/attendance" className="menu-btn" onClick={() => this.closeMenu()}>Attendance</NavLink>
                    <a className="menu-btn" href="http://www.jmarrr.com/chillydawgs/conditioning/">Workouts</a>
                    {user.type==="coach"?<a className="menu-btn" href="https://docs.google.com/document/d/1GdU6GmBf8OQCiemrtN9fRvkzdJg-NjT2NuR8FV6n1u4/edit">Practice Plan</a>:''}
                    <a className="menu-btn" href="https://www.ultiplays.com/teams/5bcf26c867e8380013b2827c/plays">Ultiplays</a>
                    <a className="menu-btn" href="https://www.ultianalytics.com/app/index.html#/5720008109850624/players">Ultianalytics</a>
                    {user.type==="coach"?<a className="menu-btn" href="https://docs.google.com/spreadsheets/d/1BtZMeBJQokDkfN_v1NyShBI3sbkF8kVe6MuVJsIC1EA/edit#gid=0">Spreadsheet</a>:''}
                    <Link className="menu-btn" onClick={this.doLogout} to="/logout">Logout</Link>
                </Menu>
                <div className="header-wrapper">
                    <h1><NavLink to="/dashboard">Chillydwags</NavLink></h1>
                </div>
                <div className="fake-shadow"> </div>
            </header>
        )
    }
}
export default Header;