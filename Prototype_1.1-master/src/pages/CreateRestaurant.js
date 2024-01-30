/*  Components: CreateRestaurant

    Functions: 
    
    Author: Skylar Riopel

    description: Page for creating new restaurant, currently does not add for restaurant because payement is not yet implemented and also some
    modifications might need to be made to user database

    Notes:Does not add restaurant
     */
import React, { useReducer, useState, useEffect } from "react";
import { RestaurantData } from '../components/RestaurantData';
import { UserData } from '../components/UserData';
import { useParams, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { masKey,reqString,req1String } from ".//Data";

const formReducer = (state, event) => {
    return {
        ...state,
        [event.name]: event.value
    }
}


function CreateRestaurant() {
    window.scrollTo(0, 0);
    //restaruant database connection
    let req = new XMLHttpRequest();
    var tempRestsItems;
    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            tempRestsItems = req.responseText.substring(10, req.responseText.length - 100);
            if (sessionStorage.getItem("restaurants") != tempRestsItems && tempRestsItems != "") {
                sessionStorage.setItem("restaurants", tempRestsItems);
                window.location.reload();
            }
        }
    };

    req.open("GET", "https://api.jsonbin.io/v3/b/"+reqString+"/latest", true);
    req.setRequestHeader("X-Master-Key", masKey);
    req.send();
    tempRestsItems = JSON.parse(sessionStorage.getItem("restaurants"));
    ////////
    const [sent, setSent] = useState(0);
    let { id } = useParams();

    var user;
    var isOwner;
    try {
        user = jwt_decode(sessionStorage.getItem("user"));
    } catch (error) {

    }
    if (sessionStorage.getItem("user") != "" && sessionStorage.getItem("user") != null) {
        isOwner = UserData.find(item => {
            return item.username == user.sub;
        });
    }
    var pass;
    if (isOwner != null) {
        pass = isOwner.restaurants.find(itm => {
            return itm.id == id;
        })
    }

    const queryParams = new URLSearchParams(window.location.search);

    const restName = queryParams.get('rName');
    const restDescription = queryParams.get('rDes');
    const restAddress = queryParams.get('rAddress');
    const restPicture = queryParams.get('rPic');
    if (restName != null && restDescription != null && restAddress != null && restPicture != null) {
        if (sessionStorage.getItem("sent") == 0) {//check if sent to database
            sessionStorage.setItem("sent", 1);
            window.location.reload();
            return (
                <div className="restaurants">
                    <div class="container1">
                        {/* Show info */}
                        <h2>Restaurant Creating</h2>
                        <br /><br />
                        <div>
                            <h3>
                                Restaurant Name:
                            </h3>
                            <div>
                                {restName}
                            </div><br />
                            <h3>
                                Restaurant Description:
                            </h3>
                            <div>
                                {restDescription}
                            </div><br />
                            <h3>
                                Restaurant Address:
                            </h3>
                            <div>
                                {restAddress}
                            </div><br />
                            <h3>
                                Restaurant Picture:
                            </h3>
                            <div>
                                <img className="max200" src={restPicture}></img>
                            </div><br />
                        </div>
                        <Link to='#' className='button2'>
                            Go Back to create page
                        </Link><br /><br />
                    </div>
                </div>
            );
        }
        //"Restaurant Created" currently does not add to database as payement is needed
        return (
            <div className="restaurants">
                <div class="container1">
                    {/* Show info */}
                    <h2>Restaurant Created</h2><h5>(Does not add Currently)</h5>
                    <br /><br />
                    <div>
                        <h3>
                            Restaurant Name:
                        </h3>
                        <div>
                            {restName}
                        </div><br />
                        <h3>
                            Restaurant Description:
                        </h3>
                        <div>
                            {restDescription}
                        </div><br />
                        <h3>
                            Restaurant Address:
                        </h3>
                        <div>
                            {restAddress}
                        </div><br />
                        <h3>
                            Restaurant Picture:
                        </h3>
                        <div>
                            <img className="max200" src={restPicture}></img>
                        </div><br />
                    </div>
                    <Link to='#' className='button2'>
                        Go Back to modification page
                    </Link><br /><br />
                </div>
            </div>
        );
    }

    
    //create page
    if (sessionStorage.getItem("user") != "") {
        sessionStorage.setItem("sent", 0);
        return (
            <div className="restaurants">
                <div class="container1">

                    <div className="center1">
                        <div className='res-text max200'>
                            <h2>Creating New Restaurant</h2>
                            {/* Form for creating restaurant */}
                            <form>
                                <br /><br />
                                <label required for="rName">Restaurant Name:</label>&emsp;
                                <input required type="text" id="rName" name="rName" /><br /><br />
                                <label for="rDes">Description:</label>&emsp;&nbsp;
                                <textarea className="input" required id="rDes" name="rDes" rows="4" cols="40"></textarea><br /><br />
                                <label for="rAddress">Address:</label>&emsp;&emsp;&emsp;
                                <input className="input" required type="text" id="rAddress" name="rAddress" /><br /><br />
                                <label for="rPic">Picture URL:</label>&emsp;&emsp;&emsp;
                                <input className="input" required type="url" id="rPic" name="rPic" /><br /><br />



                                <div>
                                    <button type="submit" to='#' className="button2">
                                        Buy and Create restaurant
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="restaurants">
                <div className="container1">
                    <div className="red_color">Access Denied</div>
                </div>
            </div>);
    }
}

export default CreateRestaurant;