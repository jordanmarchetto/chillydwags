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
                    <a href="https://api.jmar.dev"><span className="footer-icon"><SubdirectoryArrowRight fontSize="small" /></span>Jordan Marchetto</a> {`${process.env.PUBLIC_URL}/`}
                </div>
            </footer>
        )
    }
}
export default Footer;