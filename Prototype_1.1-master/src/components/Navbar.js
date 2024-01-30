/*  Components: Navbar

    Functions:
    
    Author: Skylar Riopel

    description: sidebar navigation component

    Notes:
     */
import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link, useLocation  } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons';

function Navbar() {
    if(sessionStorage.getItem("user") == null){
        // var userObject = jwt_decode(sessionStorage.getItem("user"));
         console.log("wowowow");
        // setUser(userObject);
        sessionStorage.setItem("user","");
        //if(user != )
    }
    if(sessionStorage.getItem("ordersList") == null){
        sessionStorage.setItem("ordersList","[]");
    }
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => {setSidebar(!sidebar); if(!sidebar){document.body.style.overflow = "hidden";}else{document.body.style.overflow = "visible";}}
    const { search } = useLocation();

    return (
        <div data-testid="navbar">
            <IconContext.Provider value={{color:'#fff'}}>
                <div className="navbar">
                    <Link to={'#'+search} className='menu-bars'>
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>&emsp;
                    <div className='white-text'>OMS</div>
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className="navbar-toggle">
                            <Link to={'#'+search} className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {SidebarData.map((item, index) => {
                            if(index == 3 ){
                                if(sessionStorage.getItem("user") != ""){
                                    return (
                                        <>
                                        </>
                                    );
                                }else{
                                    return (
                                        <li key={index} className={item.cName}>
                                            <Link to={item.path} onClick={() => {window.scrollTo(0, 0);}}>
                                            <IconContext.Provider value={{ color: "white"}}>
                                                {item.icon}
                                            </IconContext.Provider>
                                                <span>{item.title}</span>
                                            </Link>
                                        </li>
                                    );
                                }
                            }if(index == 4 ){
                                if(sessionStorage.getItem("user") != ""){
                                    return (
                                        <li key={index} className={item.cName}>
                                            <Link to={item.path} onClick={() => {window.scrollTo(0, 0);}}>
                                            <IconContext.Provider value={{ color: "white"}}>
                                                {item.icon}
                                            </IconContext.Provider>
                                                <span>{item.title}</span>
                                            </Link>
                                        </li>
                                    );
                                }else{
                                    return (
                                        <></>
                                    );
                                }
                            }if(index == 5 ){
                                if(sessionStorage.getItem("user") != ""){
                                    return (
                                        <li key={index} className={item.cName}>
                                            <Link to={item.path} onClick={() => {window.scrollTo(0, 0);}}>
                                            <IconContext.Provider value={{ color: "white"}}>
                                                {item.icon}
                                            </IconContext.Provider>
                                                <span>{item.title}</span>
                                            </Link>
                                        </li>
                                    );
                                }else{
                                    return (
                                        <></>
                                    );
                                }
                            }else{
                                return (
                                    <li key={index} className={item.cName}>
                                        <Link to={item.path} onClick={() => {window.scrollTo(0, 0);}}>
                                        <IconContext.Provider value={{ color: "white"}}>
                                            {item.icon}
                                        </IconContext.Provider>
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            }
                        })}
                    </ul>
                </nav>
                <a onClick={showSidebar} className={sidebar ? 'darken' : 'darken active'}></a>
            </IconContext.Provider>
        </div>
    )
}

export default Navbar;