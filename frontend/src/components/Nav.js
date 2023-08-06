import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../Nav.css';

class Nav extends Component {
    state = { clicked: false }

    handleClick = () => {
        this.setState({clicked: !this.state.clicked})
    }

    render() {
        return (
            <nav className = "Navbar">
                <h1 className='navbar-logo'>Website Name</h1>
                <div className='menu-icon' onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fa-solid fa-x' : 'fa-solid fa-bars'}></i>
                </div>
                <div>
                    <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                        <li><Link to='/Calculator' className= { 'nav-link' }>Value Calculator</Link></li>
                        <li><Link to='/Analysis' className= { 'nav-link' }>Analysis</Link></li>
                    </ul>
                </div>
            </nav> 
        );
    }
}

export default Nav;