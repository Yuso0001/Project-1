/*  Components:

    Functions:
    
    Author: Skylar Riopel

    description: holds all options for navigation bar

    Notes:
     */
import React from 'react'
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as FaIcons from 'react-icons/fa';
import * as BiIcons from 'react-icons/bi';
import * as Io5Icons from "react-icons/io5";

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Restaurants',
        path: '/restaurants',
        icon: <Io5Icons.IoFastFood />,
        cName: 'nav-text'
    },
    {
        title: 'Cart',
        path: '/cart',
        icon: <AiIcons.AiOutlineShoppingCart />,
        cName: 'nav-text'
    },
    {
        title: 'Login',
        path: '/login',
        icon: <BiIcons.BiLogIn />,
        cName: 'nav-text'
    },
    {
        title: 'Logout',
        path: '/login',
        icon: <BiIcons.BiLogOut />,
        cName: 'nav-text'
    },
    {
        title: 'Your Restaurants',
        path: '/your-restaurants',
        icon: <FaIcons.FaStoreAlt />,
        cName: 'nav-text'
    },
]