/**
 * Footer.js
 * Sitewide footer
 */
import React, { Component } from 'react';
import { SubdirectoryArrowRight } from '@material-ui/icons';

class Footer extends Component {
    render() {
        return (
            <footer>
                <div className="footer-wrapper">
                    <a href="https://api.jmar.dev"><span className="footer-icon"><SubdirectoryArrowRight fontSize="small" /></span>Jordan Marchetto</a> 
                </div>
                <span className="hidden">{process.env.REACT_APP_REGION + " build"}</span>
            </footer>
        )
    }
}
export default Footer;