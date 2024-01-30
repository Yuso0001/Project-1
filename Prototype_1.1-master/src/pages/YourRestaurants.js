/*  Components: YourRestaurants

    Functions:
    
    Author: Skylar Riopel

    description: Shows all the restaurants logged in user owns

    Notes:
     */
import React, { useState, useEffect } from "react";
import { RestaurantData } from '../components/RestaurantData';
import { UserData } from '../components/UserData';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { masKey,reqString,req1String } from ".//Data";

function YourRestaurants() {
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

    var tempUsersItems = [JSON.parse(sessionStorage.getItem("userData"))];

    var hasRestaurants = false;
    if (sessionStorage.getItem("user") != "") {
        return (
            <div className="restaurants">
                <div class="container1">
                    <h2>Your Restaurants</h2><br/>
                    {tempUsersItems.map((item, index) => {
                        var userObject = jwt_decode(sessionStorage.getItem("user"));
                        //console.log(userObject.sub);
                        //console.log(item.username);
                        if (item.username == userObject.sub) {
                            return (
                                tempRestsItems.map((restItem, restIndex) =>{
                                    hasRestaurants = true;
                                    return (
                                        item.restaurants.map((oRestItem, oRestIndex) =>  {
                                            //console.log(restItem.id);
                                            //console.log(oRestItem.id);
                                            if (oRestItem.id == restItem.id) {//find owned restaurants
                                                return (
                                                    <>
                                                    <div>
                                                        <div>{restItem.name.replace("\"","\'")}</div>
                                                        {/* link to your restaurant */}
                                                        <Link to={"/modify-restaurant/"+restItem.id} className="button2">Modify Restaurant data</Link>
                                                    </div>
                                                    <br/>
                                                    </>
                                                );
                                            }
                                        })
                                    );
                                })

                            );


                        }else{
                            return(<> </>);
                        }
                    })}
                    {hasRestaurants?<></>:<>You do not own any restaurants</>}<br></br>
                    <Link to='/create-restaurant' className="button2">Buy A Restaurant</Link><br/><br/>
                </div>
            </div>
        );
    }else{
        return(<></>);
    }
}

export default YourRestaurants;