/*  Components: Createeal

    Functions: 
    
    Author: Skylar Riopel

    description: Page for creating a new meal

    Notes:
     */
import React, { useReducer, useState, useEffect } from "react";
import { RestaurantData } from '../components/RestaurantData';
import { UserData } from '../components/UserData';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { masKey,reqString,req1String } from ".//Data";

const formReducer = (state, event) => {
    return {
        ...state,
        [event.name]: event.value
    }
}

function CreateMeal() {
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

    const mealName = queryParams.get('mName');
    const mealDescription = queryParams.get('mDes');
    const mealType = queryParams.get('mType');
    const mealPrice = queryParams.get('mPrice');
    const mealPicture = queryParams.get('mPic');
    const mealamtS = queryParams.get('mAmtS');
    const mealamtD = queryParams.get('mAmtD');

    if (mealName != null && mealDescription != null && mealPrice != null && pass != null) {
        //create meal
        if (sessionStorage.getItem("sent") == 0) {//check if sent to database
            var temp1;
            var temp3;

            tempRestsItems.find((obj, index) => {
                temp1 = index;
                return obj.id == nameId;
            });

            tempRestsItems[temp1].meals.lastIndexOf((obj, index) => {
                temp3 = index;
                return obj.mealType == mealType;
            });
            tempRestsItems[temp1].meals.map((itm, indx) => {
                if (itm.mealType == mealType) {
                    temp3 = indx;
                }

            })

            //console.log(temp3);
            var max1 = 0;
            var temp2;
            tempRestsItems[temp1].meals.map((itm, indx) => {
                if (max1 < Number(itm.id)) {
                    max1 = Number(itm.id);
                    temp2 = indx;
                }
            });
            var test = Object.assign({}, tempRestsItems[temp1].meals[temp2]);//clone meal and then update to user input and add 1 to id
            //tempRestsItems[temp1].meals.push(test);
            test.id = (Number(test.id) + 1).toString();////////
            //console.log(test.id);
            test.name = mealName;
            test.description = mealDescription;
            test.mealType = mealType
            test.price = Number(mealPrice);
            test.picture = mealPicture;
            test.amtOfSides = Number(mealamtS);
            test.amtOfDrinks = Number(mealamtD);
            test.sales = 0;
            tempRestsItems[temp1].meals.splice(temp3 + 1, 0, test);
            req.open("PUT", "https://api.jsonbin.io/v3/b/"+reqString, true);//send to database
            req.setRequestHeader("Content-Type", "application/json");
            req.setRequestHeader("X-Master-Key", masKey);
            req.send(JSON.stringify(tempRestsItems));
            sessionStorage.setItem("sent", 1);
            return (
                <div className="restaurants">
                    <div class="container1">
                        {/* Show info */}
                        <h2>Meal Creating</h2>
                        <br /><br />
                        <div>
                            <h3>
                                Meal Name:
                            </h3>
                            <div>
                                {mealName}
                            </div><br />
                            <h3>
                                Meal Description:
                            </h3>
                            <div>
                                {mealDescription}
                            </div><br />
                            <h3>
                                Meal Price:
                            </h3>
                            <div>
                                {mealPrice}$
                            </div><br />
                            <h3>
                                Meal Picture:
                            </h3>
                            <div>
                                <img className="max200" src={mealPicture}></img>
                            </div><br />
                            <h3>
                                Meal Amount of Sides:
                            </h3>
                            <div>
                                {mealamtS}
                            </div><br />
                            <h3>
                                Meal Amount of Drinks:
                            </h3>
                            <div>
                                {mealamtD}
                            </div><br />
                        </div>
                        <Link to='#' className='button2'>
                            Go back to Create Page
                        </Link><br /><br />
                    </div>
                </div>
            );
        }
        //sent to database
        return (
            <div className="restaurants">
                <div class="container1">
                    {/* Show info */}
                    <h2>Meal Created</h2>
                    <br /><br />
                    <div>
                        <h3>
                            Meal Name:
                        </h3>
                        <div>
                            {mealName}
                        </div><br />
                        <h3>
                            Meal Description:
                        </h3>
                        <div>
                            {mealDescription}
                        </div><br />
                        <h3>
                            Meal Price:
                        </h3>
                        <div>
                            {mealPrice}$
                        </div><br />
                        <h3>
                            Meal Picture:
                        </h3>
                        <div>
                            <img className="max200" src={mealPicture}></img>
                        </div><br />
                        <h3>
                            Meal Amount of Sides:
                        </h3>
                        <div>
                            {mealamtS}
                        </div><br />
                        <h3>
                            Meal Amount of Drinks:
                        </h3>
                        <div>
                            {mealamtD}
                        </div><br />
                    </div>
                    <Link to='#' className='button2'>
                        Go back to Create Page
                    </Link><br /><br />
                </div>
            </div>
        );
    }

    //create page
    if (sessionStorage.getItem("user") != "" && pass != null && verif == 1) {
        sessionStorage.setItem("sent", 0);
        return (
            <div className="restaurants">
                <div class="container1">
                    {tempRestsItems.map((item, index) => {
                        if (item.id == nameId) {
                            return (
                                <div className="center1" key={index}>
                                    <div key={index} className='res-text max200'>
                                        <h2>Creating New Meal for {item.name.replace("\"", "\'")}</h2>
                                        {/* Form for creating new meal */}
                                        <form>
                                            <br /><br />
                                            <label required for="mName">Meal Name:</label>&emsp;
                                            <input required type="text" id="mName" name="mName" /><br /><br />
                                            <label for="mDes">Description:</label>&emsp;&nbsp;
                                            <textarea className="input" required id="mDes" name="mDes" rows="4" cols="40"></textarea><br /><br />
                                            <label required for="mType">Meal type:</label>&emsp;
                                            <input required type="text" id="mType" name="mType" /><br /><br />
                                            <label required for="mPrice">Meal Price:</label>&emsp;
                                            <input required type="number" step="0.01" id="mPrice" name="mPrice" /><br /><br />
                                            <label for="mPic">Picture URL:</label>&emsp;&emsp;&emsp;
                                            <input className="input" required type="text" id="mPic" name="mPic" /><br /><br />
                                            <label required for="mAmtS">Meal Amount of Sides:</label>&emsp;
                                            <input defaultValue={0} required type="number" min={0} step="1" id="mAmtS" name="mAmtS" /><br /><br />
                                            <label required for="mAmtD">Meal Amount of Drinks:</label>&emsp;
                                            <input defaultValue={0} required type="number" min={0} step="1" id="mAmtD" name="mAmtD" /><br /><br />


                                            <button type="submit" to='#' className="button2">
                                                Create Meal
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

export default CreateMeal;