/*  Components: ModifyRestaurant

    Functions: 
    
    Author: Skylar Riopel

    description: Page for modifying restaurant (ex picture, for restaurant owner)

    Notes:
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


function ModifyRestaurant() {
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
    const [verif, setVerif] = useState(0);
    //user database connection
    let req1 = new XMLHttpRequest();
    var tempUsersItems;
    req1.onreadystatechange = () => {
        if (req1.readyState == XMLHttpRequest.DONE) {
            try{
            tempUsersItems = JSON.parse(req1.responseText.substring(10, req1.responseText.length - 100));
            }catch (error){

            }
            //console.log(req1.responseText.substring(10, req1.responseText.length - 100));
            if (tempUsersItems != null) {
                var userObject = jwt_decode(sessionStorage.getItem("user"));
                //console.log(tempUsersItems);
                var found = 0;
                var temp1 = tempUsersItems.find(itm => {
                    if(itm.username == userObject.sub){
                        found = 1;
                    }
                    return itm.username == userObject.sub;
                });
                if(temp1 != null && sessionStorage.getItem("userData") == JSON.stringify(temp1)){
                    setVerif(1);
                }
                if(temp1 != null && sessionStorage.getItem("userData") != JSON.stringify(temp1)){
                    sessionStorage.setItem("userData",JSON.stringify(temp1));
                    setVerif(1);
                    //window.location.reload(false);
                }
                else if (userObject.sub != null && temp1 == null) {
                    var tempObj = 
                        {
                            "username": userObject.sub,
                            "favorites": [],
                            "restaurants": []
                        };
                    sessionStorage.setItem("userData",JSON.stringify(tempObj));
                    tempUsersItems.push(tempObj);
                    req1.open("PUT", "https://api.jsonbin.io/v3/b/"+req1String, true);
                    req1.setRequestHeader("Content-Type", "application/json");
                    req1.setRequestHeader("X-Master-Key", masKey);
                    req1.send(JSON.stringify(tempUsersItems));
                }
            }
        }
    };

    req1.open("GET", "https://api.jsonbin.io/v3/b/"+req1String+"/latest", true);
    req1.setRequestHeader("X-Master-Key", masKey);
    req1.send();
    //////


    const [sent, setSent] = useState(0);
    let { id } = useParams();

    var user;
    var isOwner;
    try {
        user = jwt_decode(sessionStorage.getItem("user"));
    } catch (error) {

    }
    // if (sessionStorage.getItem("user") != "" && sessionStorage.getItem("user") != null) {
    //     isOwner = UserData.find(item => {
    //         return item.username == user.sub;
    //     });
    // }
    isOwner = JSON.parse(sessionStorage.getItem("userData"));
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
    if (restName != null && restDescription != null && restAddress != null && restPicture != null && pass != null) {
        //console.log(verif);
        if (sessionStorage.getItem("sent") == 0) {//check if sent to database
            //update restaurant
            var temp1;
            tempRestsItems.find((obj, index) => {//find restaurant
                temp1 = index;
                return obj.id == id;
            });
            tempRestsItems[temp1].name = restName;//update restaurant and send to database
            tempRestsItems[temp1].description = restDescription;
            tempRestsItems[temp1].address = restAddress;
            tempRestsItems[temp1].pic = restPicture;
            //sessionStorage.setItem("restaurants", JSON.stringify(tempRestsItems));
            req.open("PUT", "https://api.jsonbin.io/v3/b/"+reqString, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("X-Master-Key", masKey);
            req.send(JSON.stringify(tempRestsItems));
            sessionStorage.setItem("sent", 1);
            //while(verif == 0){}
            return (
                <div className="restaurants">
                    <div class="container1">
                        {/* Show info */}
                        <h2>Restaurant Updating</h2>
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
                                <img src={restPicture} className="max200"></img>
                            </div><br />
                        </div>
                        <Link to='#' className='button2'>
                            Go Back to modification page
                        </Link><br /><br />
                    </div>
                </div>
            );
        }
        //restaurant updated
        return (
            <div className="restaurants">
                <div class="container1">
                    <h2>Restaurant Updated</h2>
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
                            <img src={restPicture} className="max200"></img>
                        </div><br />
                    </div>
                    <Link to='#' className='button2'>
                        Go Back to modification page
                    </Link><br /><br />
                </div>
            </div>
        );
    }

    
    
    if (sessionStorage.getItem("user") != "" && pass != null && verif == 1) {
        sessionStorage.setItem("sent", 0);
        return (
            <div className="restaurants">
                <div class="container1">
                    {tempRestsItems.map((item, index) => {
                        if (item.id == id) {//find restaurant
                            return (
                                <div className="center1" key={index}>
                                    <div key={index} className='res-text max200'>
                                        <div className="button-text">Modifying {item.name.replace("\"", "\'")}</div>
                                        {/* Form for updating restaurant */}
                                        <form>
                                            <br /><br />
                                            <label required for="rName">Restaurant Name:</label>&emsp;
                                            <input defaultValue={item.name.replace("\"", "\'")} required type="text" id="rName" name="rName" /><br /><br />
                                            <label for="rDes">Description:</label>
                                            <textarea className="input" required defaultValue={item.description} id="rDes" name="rDes" rows="4" cols="40"></textarea><br /><br />
                                            <label for="rAddress">Address:</label>
                                            <input className="input" required defaultValue={item.address} type="text" id="rAddress" name="rAddress" /><br /><br />
                                            <label for="rPic">Picture URL:</label>
                                            <input className="input" required defaultValue={item.pic} type="url" id="rPic" name="rPic" /><br /><br />
                                            <div>
                                            <label for="Pic">Current Picture Preview:</label>
                                            </div>
                                            <img src={item.pic} className='max200' id="Pic" name="Pic"></img>
                                            <h2>Total number of orders:</h2>
                                            <h3>{item.orders}</h3>


                                            <button type="submit" to='#' className="button2" onClick={() => {
                                                req1.open("GET", "https://api.jsonbin.io/v3/b/"+req1String+"/latest", true);
                                                req1.setRequestHeader("X-Master-Key", masKey);
                                                req1.send();
                                            }}>
                                                Save Modifications
                                            </button>
                                        </form>
                                        <div>
                                            <br /><br />
                                            <Link className="button3" to={'/modify-meals/' + item.id}>
                                                Modify {item.name.replace("\"", "\'")} Meals
                                            </Link><br /><br />
                                        </div>
                                        <div>
                                            <Link to={'/your-restaurants'} className='button2'>
                                                Go Back To View All Restaurants
                                            </Link><br /><br />
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            return (<></>);
                        }
                    }
                    )}

                </div>
            </div>
        );
    }else if(verif == 0){//security
        return (
            <div className="restaurants">
                <div className="container1">
                    <div>Verifying</div>
                </div>
            </div>);
    } else {
        return (
            <div className="restaurants">
                <div className="container1">
                    <div className="red_color">Access Denied</div>
                </div>
            </div>);
    }
}

export default ModifyRestaurant;