/*  Components: Foot

    Functions:
    
    Author: Skylar Riopel

    description: display for foot. Just general information

    Notes: Will need to have real information eventually
     */
import React from 'react'
import { Link } from 'react-router-dom';
import logo from './assets/JTS2.png';

function Foot() {
    return (
        <footer className='foot'>
          <div className='left-foot'>
            <div>{/*Diplay temporary filler information */}
              <h3>Contact Us</h3>
              <p>email@fakeemail.com <br/> +1 (800) 555-9999</p><br />
              <img src={logo} />
            </div>
          </div>
        </footer>
    );
}

export default Foot;