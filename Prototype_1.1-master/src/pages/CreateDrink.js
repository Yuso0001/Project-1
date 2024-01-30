/*  Components: CreateDrink

    Functions: 
    
    Author: Skylar Riopel

    description: Page for creating a new drink

    Notes:
     */
import React, { useReducer, useState, useEffect } from "react";
import { RestaurantData } from '../components/RestaurantData';
import { UserData } from '../components/UserData';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { masKey,reqString,req1String } from ".//Data";


function CreateDrink() {
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
                    window.location.reload(false);
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

    const drinkName = queryParams.get('dName');
    const drinkPrice = queryParams.get('dPrice');

    if (drinkName != null && drinkPrice != null && pass != null) {
        //create drink
        if (sessionStorage.getItem("sent") == 0) {//check if sent to database
            var temp1;

            tempRestsItems.find((obj, index) => {
                temp1 = index;
                return obj.id == nameId;
            });

            var temp2 = tempRestsItems[temp1].drinks.length;
            var test = Object.assign({}, tempRestsItems[temp1].drinks[temp2 - 1]);//clone last drink and then fill it with user input and ad 1 to id
            tempRestsItems[temp1].drinks.push(test);
            tempRestsItems[temp1].drinks[temp2].id = (Number(tempRestsItems[temp1].drinks[temp2].id) + 1).toString();
            tempRestsItems[temp1].drinks[temp2].name = drinkName;
            tempRestsItems[temp1].drinks[temp2].dPriceDiff = Number(drinkPrice);
            req.open("PUT", "https://api.jsonbin.io/v3/b/"+reqString, true);//send to database
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("X-Master-Key", masKey);
            req.send(JSON.stringify(tempRestsItems));
            sessionStorage.setItem("sent", 1);//sent
            return (
                <div className="restaurants">
                    <div class="container1">
                        {/* Show info */}
                        <h2>Drink Creating</h2>
                        <br /><br />
                        <div>
                            <h3>
                                Meal Name:
                            </h3>
                            <div>
                                {drinkName}
                            </div><br />
                            <h3>
                                Meal Price:
                            </h3>
                            <div>
                                {drinkPrice}
                            </div><br />
                        </div>
                        <Link to='#' className='button2'>
                            Go Back to Create Page
                        </Link><br /><br />
                    </div>
                </div>
            );
        }//meal created
        return (
            <div className="restaurants">
                <div class="container1">
                    {/* Show info */}
                    <h2>Drink Created</h2>
                    <br /><br />
                    <div>
                        <h3>
                            Drink Name:
                        </h3>
                        <div>
                            {drinkName}
                        </div><br />
                        <h3>
                            Drink Price:
                        </h3>
                        <div>
                            {drinkPrice}
                        </div><br />
                    </div>
                    <Link to='#' className='button2'>
                        Go Back to Create Page
                    </Link><br /><br />
                </div>
            </div>
        );
    }

    //create page
    if (sessionStorage.getItem("user") != "" && pass != null) {
        sessionStorage.setItem("sent", 0);
        return (
            <div className="restaurants">
                <div class="container1">
                    {tempRestsItems.map((item, index) => {
                        if (item.id == nameId) {
                            return (
                                <div className="center1" key={index}>
                                    <div key={index} className='res-text'>
                                        <h2>Creating New Drink for {item.name.replace("\"", "\'")}</h2>
                                        {/* Form for input for new drink */}
                                        <form>
                                            <br /><br />
                                            <label required for="dName">Drink Name:</label>&emsp;
                                            <input required type="text" id="dName" name="dName" /><br /><br />
                                            <label required for="dPrice">Price Difference:</label>&emsp;
                                            <input defaultValue={0} required type="number" step="0.01" min={0} id="dPrice" name="dPrice" /><br /><br />

                                            <button type="submit" to='#' className="button2">
                                                Create Drink
                                            </button>
                                        </form>
                                        <div>
                                            <br />
                                            <Link to={'/modify-meals/' + nameId} className='button2'>
                                                Go Back To View Entire Menu
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
    } else if(verif == 0){//security
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

export default CreateDrink;