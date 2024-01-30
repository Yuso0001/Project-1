/*  Components: ModifyMeals

    Functions: 
    
    Author: Skylar Riopel

    description: Page to view wntire menu to rederect to modification page

    Notes:
     */
import React, { useReducer, useState, useEffect } from "react";
import { RestaurantData } from '../components/RestaurantData';
import { UserData } from '../components/UserData';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import matchers from "@testing-library/jest-dom/matchers";
import { masKey,reqString,req1String } from ".//Data";

const formReducer = (state, event) => {
    return {
        ...state,
        [event.name]: event.value
    }
}


function ModifyMeals() {
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

    let { id } = useParams();
    const [rName, setRName] = useReducer(formReducer, {});
    const [rDes, setRDes] = useReducer(formReducer, {});
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
    //show restaurant owner all meals sides and drinks
    if (sessionStorage.getItem("user") != "" && pass != null && verif == 1) {
        return (
            <div className="restaurants">
                <div class="container1">
                    <h3>Meals:</h3><br />
                    {tempRestsItems.map((item, index) => {
                        if (item.id == id) {//find restaurant
                            return (
                                <div key={index}>
                                    <div className="grid_fit">
                                        {item.meals.map((item1, index1) => {//meals
                                            return (
                                                <div className="center1">
                                                    <div className='res-text'>
                                                        {item1.name}
                                                        <div>
                                                            <Link className="button2" to={'/modify-meal/' + item.id + '_' + item1.id}>
                                                                Modify
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>);
                                        }
                                        )}
                                    </div>
                                    <div>
                                        <Link className="button2" to={'/create-meal/' + item.id}>
                                            Create New Meal
                                        </Link>
                                    </div><br /><br />
                                </div>
                            );
                        } else {
                            return (<></>);
                        }
                    }
                    )}
                    <div className="border1" />
                    <h3>Sides:</h3><br />
                    {tempRestsItems.map((item, index) => {//show sides
                        if (item.id == id) {//find resturant
                            return (
                                <div key={index}>
                                    <div className="grid_fit">
                                        {item.sides.map((item1, index1) => {//sides
                                            return (
                                                <div className='res-text'>
                                                    {item1.name}
                                                    <div>
                                                        <Link className="button2" to={'/modify-side/' + item.id + '_' + item1.id}>
                                                            Modify
                                                        </Link>
                                                    </div>
                                                </div>);
                                        }
                                        )}
                                    </div>
                                    <div>
                                        <Link className="button2" to={'/create-side/' + item.id}>
                                            Create New Side
                                        </Link>
                                    </div><br /><br />
                                </div>
                            );
                        } else {
                            return (<></>);
                        }
                    }
                    )}
                    <div className="border1" />
                    <h3>Drinks:</h3><br />
                    {tempRestsItems.map((item, index) => {
                        if (item.id == id) {//find restaurant
                            return (
                                <div key={index}  >
                                    <div className="grid_fit">
                                        {item.drinks.map((item1, index1) => {//drinks
                                            return (
                                                <div key={index} className='res-text'>
                                                    {item1.name}
                                                    <div>
                                                        <Link className="button2" to={'/modify-drink/' + item.id + '_' + item1.id}>
                                                            Modify
                                                        </Link>
                                                    </div>
                                                </div>);
                                        }
                                        )}
                                    </div>
                                    <div>
                                        <Link className="button2" to={'/create-drink/' + item.id}>
                                            Create New Drink
                                        </Link><br /><br />
                                    </div>
                                    <div>
                                        <Link to={'/modify-restaurant/' +id } className='button2'>
                                            Go Back To Modify Restaurant
                                        </Link><br /><br />
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

export default ModifyMeals;