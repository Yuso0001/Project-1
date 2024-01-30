/*  Components: ModifySide

    Functions: 
    
    Author: Skylar Riopel

    description: Page for modifying side (ex price, for restaurant owner)

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


function ModifySide() {
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

    function deleteSide() {
        try {
            tempRestsItems = JSON.parse(tempRestsItems);
        } catch (error) {

        }
        tempRestsItems.find((obj, index) => {
            temp1 = index;
            return obj.id == nameId;
        }).sides.find((obj1, index1) => {
            temp2 = index1
            return obj1.id == mealId;
        });
        delete tempRestsItems[temp1].sides[temp2];

        req.open("PUT", "https://api.jsonbin.io/v3/b/"+reqString, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader("X-Master-Key", masKey);
        req.send(JSON.stringify(tempRestsItems).replace(",null", ""));
        return (<Navigate to={'/modify-meals/' + nameId} />);
    }

    let { id } = useParams();
    var nameId = id?.split('_')[0];
    var mealId = id?.split('_')[1];

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
            return itm.id == nameId;
        })
    }

    const queryParams = new URLSearchParams(window.location.search);

    const sideName = queryParams.get('sName');
    const sidePrice = queryParams.get('sPrice');

    if (sideName != null && sidePrice != null && pass != null) {
        //update side
        if (sessionStorage.getItem("sent") == 0) {//check if sent to database
            var temp1;
            var temp2;
            tempRestsItems.find((obj, index) => {//find restaurant
                temp1 = index;
                return obj.id == nameId;
            }).sides.find((obj1, index1) => {//find side
                temp2 = index1
                return obj1.id == mealId;
            });
            tempRestsItems[temp1].sides[temp2].name = sideName;//modify side and send to database
            tempRestsItems[temp1].sides[temp2].sPriceDiff = Number(sidePrice);
            req.open("PUT", "https://api.jsonbin.io/v3/b/"+reqString, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("X-Master-Key", masKey);
            req.send(JSON.stringify(tempRestsItems));
            sessionStorage.setItem("sent", 1);

            return (
                <div className="restaurants">
                    <div class="container1">
                        {/* Show info */}
                        <h2>Side Updating</h2>
                        <br /><br />
                        <div>
                            <h3>
                                Side Name:
                            </h3>
                            <div>
                                {sideName}
                            </div><br />
                            <h3>
                                Side Price:
                            </h3>
                            <div>
                                {sidePrice}
                            </div><br />
                        </div>
                        <Link to='#' className='button2'>
                            Go Back to modification page
                        </Link><br /><br />
                    </div>
                </div>
            );
        }
        // updated
        return (
            <div className="restaurants">
                <div class="container1">
                    {/* Show info */}
                    <h2>Side Updated</h2>
                    <br /><br />
                    <div>
                        <h3>
                            Side Name:
                        </h3>
                        <div>
                            {sideName}
                        </div><br />
                        <h3>
                            Side Price:
                        </h3>
                        <div>
                            {sidePrice}
                        </div><br />
                    </div>
                    <Link to='#' className='button2'>
                        Go Back to modification page
                    </Link><br /><br />
                </div>
            </div>
        );
    }


    var success = 0;
    //modification page
    if (sessionStorage.getItem("user") != "" && pass != null && verif == 1) {
        sessionStorage.setItem("sent", 0);
        return (
            <div className="restaurants">
                <div class="container1">
                    {tempRestsItems.map((item, index) => {
                        if (item.id == nameId) {//find restaurant
                            return (
                                <div className="center1" key={index}>
                                    <div key={index} className='res-text max200'>
                                        {item.sides.map((item1, index1) => {
                                            if (item1.id == mealId) {//find side
                                                success = 1;
                                                return (
                                                    <div className='res-text'>
                                                        <h3>Modifiying {item1.name}</h3>
                                                        {/* Form to modify side */}
                                                        <form>
                                                            <label required for="sName">Side Name:</label>&emsp;
                                                            <input defaultValue={item1.name.replace("\"", "\'")} required type="text" id="sName" name="sName" /><br /><br />
                                                            <label required for="dName">Price Difference:</label>&emsp;
                                                            <input defaultValue={item1.sPriceDiff} required type="number" step="0.01" min={0} id="sPrice" name="sPrice" /><br /><br />

                                                            <button type="submit" to='#' className="button2">
                                                                Save Modifications
                                                            </button>
                                                        </form>
                                                        {/* Delete Button and action */}
                                                        <div><br />
                                                            <button className="button2" onClick={() => {
                                                                deleteSide();
                                                            }}>
                                                                Delete Side
                                                            </button>
                                                        </div>
                                                    </div>);
                                            } else {
                                                if (index1 == item.sides.length - 1 && success == 0) {//item deleted
                                                    return (
                                                        <div>
                                                            <div className="text-10">Item has been deleted</div><br />
                                                        </div>
                                                    );
                                                }
                                            }
                                        }
                                        )}
                                        <div>
                                            <Link to={'/modify-meals/' + nameId} className='button2'>
                                                Go Back To View All Meals
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
    }  else {
        return (
            <div className="restaurants">
                <div className="container1">
                    <div className="red_color">Access Denied</div>
                </div>
            </div>);
    }
}

export default ModifySide;