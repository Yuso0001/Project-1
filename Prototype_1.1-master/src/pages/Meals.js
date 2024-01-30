/*  Components: Meals

    Functions: Private: handleOrder
    
    Author: Skylar Riopel

    description: display info for certain meal and give sides and drink options

    Notes:Currently the database has both meals[] drinks[] and sides[] this might change to one in database with more variables for a meal[]
     */
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { RestaurantData } from '../components/RestaurantData';
import '../components/Restaurants.css';
import { Link } from 'react-router-dom';
import { masKey,reqString,req1String } from ".//Data";

function Meals() {
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

    //method to add an order to the cart
    function handleOrder(jsonMeal) {
        var temp = sessionStorage.getItem("ordersList");

        var temp1 = temp.slice(1, -1);
        sessionStorage.setItem("test", "test");
        if (temp1 == "") {
            sessionStorage.setItem("ordersList", "[" + JSON.stringify(jsonMeal) + "]");
        } else {
            sessionStorage.setItem("ordersList", "[" + temp1 + "," + JSON.stringify(jsonMeal) + "]");
        }
    }

    if (sessionStorage.getItem("ordersList") == null) {/*initialize cart item */
        sessionStorage.setItem("ordersList", "[]");
    }
    const [mealCost, setCost] = useState(0);
    const [drinkArr, setDrinkArr] = useState([]);
    const [sideArr, setSideArr] = useState([]);
    const [drinkDecisionArr, setDrinkDecisionArr] = useState([]);
    const [sideDecisionArr, setSideDecisionArr] = useState([]);
    const [modify, setModify] = useState();

    let { id } = useParams();
    var nameId = id?.split('_')[0];
    //console.log(nameId);
    var mealId = id?.split('_')[1];
    var cnt = 0;
    var max = 0;
    var drinksCntArray;
    var drinkDecisionArrayTemp;
    var sidesCntArray;
    var sidesDecisionArrayTemp;
    let DrinkItemJsonText = '[';
    let SidesItemJsonText = '[';
    let orderItemJsonText = '';
    //mealId.replace('%20',' ');
    /*function to keep track of what sides and drinks you have picked */
    function onValueChange(value, number, drink, name, mi) {
        drinksCntArray = drinkArr;
        sidesCntArray = sideArr;
        drinkDecisionArrayTemp = drinkDecisionArr;
        sidesDecisionArrayTemp = sideDecisionArr;
        for (var i = 0; i < number; i++) {//fill array to correct size
            if (drinksCntArray.length <= i) {
                drinksCntArray[i] = -1;
            }
        }
        for (var i = 0; i < number; i++) {//fill array to correct size
            if (sidesCntArray.length <= i) {
                sidesCntArray[i] = -1;
            }
        }
        if (drink == 1) {
            drinksCntArray[number] = value;
            drinkDecisionArrayTemp[number] = name;
            ////console.log(number);
        } else {
            sidesCntArray[number] = value;
            sidesDecisionArrayTemp[number] = name;
            ////console.log(number);
        }
        setDrinkArr(drinksCntArray);
        setDrinkDecisionArr(drinkDecisionArrayTemp);
        setSideArr(sidesCntArray);
        setSideDecisionArr(sidesDecisionArrayTemp);
        var tot = 0;
        for (var x = 0; x < drinksCntArray.length; x++) {
            if (drinksCntArray[x] >= 0) {
                tot += drinksCntArray[x];
            }
        }
        for (var x = 0; x < sidesCntArray.length; x++) {
            if (sidesCntArray[x] >= 0) {
                tot += sidesCntArray[x];
            }
        }

        //console.log(tot);

        DrinkItemJsonText = '[';
        for (var x = 0; x < drinkDecisionArr.length; x++) {
            if (x != drinkDecisionArr.length - 1) {
                DrinkItemJsonText += '{"name":"' + drinkDecisionArr[x] + '"},';
            } else {
                DrinkItemJsonText += '{"name":"' + drinkDecisionArr[x] + '"}';
            }
        }
        DrinkItemJsonText += ']';
        SidesItemJsonText = '[';
        for (var x = 0; x < sideDecisionArr.length; x++) {
            if (x != sideDecisionArr.length - 1) {
                SidesItemJsonText += '{"name":"' + sideDecisionArr[x] + '"},';
            } else {
                SidesItemJsonText += '{"name":"' + sideDecisionArr[x] + '"}';
            }
        }
        SidesItemJsonText += ']';
        orderItemJsonText = '{ "name":"' + mi.name + '" , "description":"' + mi.description + '", "picture":"' + mi.picture + '" ,"drinks":' + DrinkItemJsonText + ', "sides":' + SidesItemJsonText + ', "price":' + Number(mi.price + tot).toFixed(2) + '  }';

        setModify(orderItemJsonText);

        setCost(Number(tot));
    }


    return (
        <div data-testid="meals" className='restaurant'>
            <br />
            {
                tempRestsItems.map((restaurantItem, index) => {//show meal and info
                    if (restaurantItem.id == nameId) {
                        return (
                            <div key={index} className="centered">
                                <div className="container1">
                                <Link className='button3' to={'/restaurants/'+nameId}>Go back to menu</Link><br/><br/>
                                    <div className="text-6">{restaurantItem.name.replace("\"", "\'")}</div><br />
                                    <br /><br />
                                    <form action='/cart'>
                                        {
                                            restaurantItem.meals.map((mealsItem, index) => {
                                                if (mealsItem.id == mealId) {
                                                    if (mealsItem.amtOfDrinks != 0) {
                                                        drinksCntArray = new Array(mealsItem.amtOfDrinks);
                                                    } else {
                                                        drinksCntArray = new Array();
                                                    }
                                                    if (mealsItem.amtOfSides != 0) {
                                                        sidesCntArray = new Array(mealsItem.amtOfSides);
                                                    } else {
                                                        sidesCntArray = new Array();
                                                    }

                                                    drinkDecisionArrayTemp = new Array();
                                                    sidesDecisionArrayTemp = new Array();
                                                    for (var i = 0; i < mealsItem.amtOfDrinks; i++) {
                                                        drinksCntArray[i] = 0;
                                                        drinkDecisionArrayTemp[i] = "fail";
                                                    }
                                                    for (var i = 0; i < mealsItem.amtOfSides; i++) {
                                                        sidesCntArray[i] = 0;
                                                        sidesDecisionArrayTemp[i] = "fail";
                                                    }
                                                    return (
                                                        <div key={index}>
                                                            <img className="very-small-image" src={mealsItem.picture} /><br />
                                                            <div className="text-8">{mealsItem.name}</div><br />
                                                            <div className="text-9">Description:</div>
                                                            <p>{mealsItem.description}</p><br />

                                                            
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                        {
                                            drinksCntArray.map((x, xIndex) => {//show drinks
                                                if (xIndex == 0) {//for showing title
                                                    return (
                                                        <div key={xIndex}>
                                                            <h4>Drinks:</h4>
                                                            {
                                                                restaurantItem.meals.map((mealsItem, index) => {
                                                                    if (mealsItem.id == mealId) {
                                                                        return (
                                                                            <div key={index}>
                                                                                <fieldset className="grid_fill-2 container5">
                                                                                    {
                                                                                        restaurantItem.drinks.map((item2, index) => {
                                                                                            if (item2.dPriceDiff == 0) {
                                                                                                return (
                                                                                                    <div key={index}>
                                                                                                        <input required type="radio" id={item2.name + xIndex} name={"drink" + xIndex} value={item2.name + xIndex} onClick={() => {
                                                                                                            onValueChange(item2.dPriceDiff, xIndex, 1, item2.name, mealsItem);
                                                                                                        }} />
                                                                                                        <label htmlFor={item2.name + xIndex}>{item2.name}</label>
                                                                                                    </div>
                                                                                                );
                                                                                            } else {
                                                                                                return (
                                                                                                    <div key={index}>
                                                                                                        <input required type="radio" id={item2.name + xIndex} name={"drink" + xIndex} value={item2.name + xIndex} onClick={() => {
                                                                                                            onValueChange(item2.dPriceDiff, xIndex, 1, item2.name, mealsItem);
                                                                                                        }} />
                                                                                                        <label htmlFor={item2.name + xIndex}>{item2.name} +{item2.dPriceDiff}$</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                                    </div>
                                                                                                );
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                </fieldset>
                                                                                <div className="border2" />
                                                                            </div>
                                                                        );
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div key={xIndex}>
                                                            {
                                                                restaurantItem.meals.map((mealsItem, index) => {
                                                                    if (mealsItem.id == mealId) {
                                                                        return (
                                                                            <div key={index}>
                                                                                <fieldset className="grid_fill-2 container5">
                                                                                    {
                                                                                        restaurantItem.drinks.map((item2, index) => {
                                                                                            if (item2.dPriceDiff == 0) {
                                                                                                return (
                                                                                                    <div key={index}>
                                                                                                        <input required type="radio" id={item2.name + xIndex} name={"drink" + xIndex} value={item2.name + xIndex} onClick={() => {
                                                                                                            onValueChange(item2.dPriceDiff, xIndex, 1, item2.name, mealsItem);
                                                                                                        }} />
                                                                                                        <label htmlFor={item2.name + xIndex}>{item2.name}</label>
                                                                                                    </div>
                                                                                                );
                                                                                            } else {
                                                                                                return (
                                                                                                    <div key={index}>
                                                                                                        <input required type="radio" id={item2.name + xIndex} name={"drink" + xIndex} value={item2.name + xIndex} onClick={() => {
                                                                                                            onValueChange(item2.dPriceDiff, xIndex, 1, item2.name, mealsItem);
                                                                                                        }} />
                                                                                                        <label htmlFor={item2.name + xIndex}>{item2.name} +{item2.dPriceDiff}$</label>
                                                                                                    </div>
                                                                                                );
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                </fieldset>
                                                                                <div className="border2" />
                                                                            </div>
                                                                        );
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                        {
                                            sidesCntArray.map((x, xIndex) => {//show sides
                                                if (xIndex == 0) {//for showing title
                                                    return (
                                                        <div key={xIndex}>
                                                            <h4>Sides:</h4>
                                                            {
                                                                restaurantItem.meals.map((mealsItem, index) => {
                                                                    if (mealsItem.id == mealId) {
                                                                        return (
                                                                            <div key={index}>
                                                                                <fieldset className="grid_fill-2 container5">
                                                                                    {
                                                                                        restaurantItem.sides.map((item2, index) => {
                                                                                            if (item2.sPriceDiff == 0) {
                                                                                                return (
                                                                                                    <>
                                                                                                        <div key={index}>
                                                                                                            <input required type="radio" id={item2.name + xIndex} name={"side" + xIndex} value={item2.name + xIndex} onClick={() => {
                                                                                                                onValueChange(item2.sPriceDiff, xIndex, 0, item2.name, mealsItem);
                                                                                                            }} />
                                                                                                            <label htmlFor={item2.name + xIndex}>{item2.name}</label>
                                                                                                        </div>
                                                                                                    </>
                                                                                                );
                                                                                            } else {
                                                                                                return (
                                                                                                    <>
                                                                                                        <div key={index}>
                                                                                                            <input required type="radio" id={item2.name + xIndex} name={"side" + xIndex} value={item2.name + xIndex} onClick={() => {
                                                                                                                onValueChange(item2.sPriceDiff, xIndex, 0, item2.name, mealsItem);
                                                                                                            }} />
                                                                                                            <label htmlFor={item2.name + xIndex}>{item2.name} +{item2.sPriceDiff}$</label>
                                                                                                        </div>
                                                                                                    </>
                                                                                                );
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                </fieldset>
                                                                                <div className="border2" />
                                                                            </div>
                                                                        );
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <>
                                                            {
                                                                restaurantItem.meals.map((mealsItem, index) => {
                                                                    if (mealsItem.id == mealId) {
                                                                        return (
                                                                            <div >
                                                                                <fieldset className="grid_fill-2 container5">
                                                                                    {
                                                                                        restaurantItem.sides.map((item2, index) => {
                                                                                            if (item2.sPriceDiff == 0) {
                                                                                                return (
                                                                                                    <div key={index}>
                                                                                                        <input required type="radio" id={item2.name + xIndex} name={"side" + xIndex} value={item2.name + xIndex} onClick={() => {
                                                                                                            onValueChange(item2.sPriceDiff, xIndex, 0, item2.name, mealsItem);
                                                                                                        }} />
                                                                                                        <label htmlFor={item2.name + xIndex}>{item2.name}</label>
                                                                                                    </div>
                                                                                                );
                                                                                            } else {
                                                                                                return (
                                                                                                    <div key={index}>
                                                                                                        <input required type="radio" id={item2.name + xIndex} name={"side" + xIndex} value={item2.name + xIndex} onClick={() => {
                                                                                                            onValueChange(item2.sPriceDiff, xIndex, 0, item2.name, mealsItem);
                                                                                                        }} />
                                                                                                        <label htmlFor={item2.name + xIndex}>{item2.name} +{item2.sPriceDiff}$</label>
                                                                                                    </div>);
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                </fieldset>
                                                                                <div className="border2" />
                                                                            </div>
                                                                        );
                                                                    }
                                                                })
                                                            }
                                                        </>
                                                    );
                                                }
                                            })
                                        }
                                        {
                                            restaurantItem.meals.map((mealsItem) => {
                                                if (mealsItem.id == mealId) {
                                                    for (var x = 0; x < drinkDecisionArr.length; x++) {
                                                        if (x != drinkDecisionArr.length - 1) {
                                                            DrinkItemJsonText += '{"name":"' + drinkDecisionArr[x] + '"},';
                                                        } else {
                                                            DrinkItemJsonText += '{"name":"' + drinkDecisionArr[x] + '"}';
                                                        }
                                                    }
                                                    DrinkItemJsonText += ']';
                                                    for (var x = 0; x < sideDecisionArr.length; x++) {
                                                        if (x != sideDecisionArr.length - 1) {
                                                            SidesItemJsonText += '{"name":"' + sideDecisionArr[x] + '"},';
                                                        } else {
                                                            SidesItemJsonText += '{"name":"' + sideDecisionArr[x] + '"}';
                                                        }
                                                    }
                                                    SidesItemJsonText += ']';
                                                    //console.log(Number(mealsItem.price) + mealCost);
                                                    orderItemJsonText = '{"restId":"' + restaurantItem.id + '" ,"mealId":"' + mealsItem.id + '" ,"name":"' + mealsItem.name + '" , "description":"' + mealsItem.description + '", "picture":"' + mealsItem.picture + '" ,"drinks":' + DrinkItemJsonText + ', "sides":' + SidesItemJsonText + ', "price":' + Number((mealsItem.price + mealCost)).toFixed(2) + ' , "restaurantName":"' + restaurantItem.name.replace('\"', '\'') + '" }';
                                                    var fail = 0;
                                                    for (var i = 0; i < drinkDecisionArr.length; i++) {
                                                        if (drinkDecisionArr[i] == null) {
                                                            fail = 1;
                                                            break;
                                                        }
                                                    }

                                                    for (var i = 0; i < sideDecisionArr.length; i++) {
                                                        if (sideDecisionArr[i] == null) {
                                                            fail = 1;
                                                            break;
                                                        }
                                                    }
                                                    //console.log(orderItemJsonText);
                                                    var tempOrderObj = JSON.parse(orderItemJsonText);
                                                    var foo = (drinkDecisionArr.length == mealsItem.amtOfDrinks && sideDecisionArr.length == mealsItem.amtOfSides && fail == 0);
                                                        return (
                                                            <div key={index}>
                                                                <label for="rDes">Specifications:</label>&emsp;&nbsp;
                                                                <textarea className="input" id="descip" name="descip" rows="4" cols="40"></textarea><br /><br />

                                                                <p>Price: {Number(mealsItem.price + mealCost).toFixed(2)}$</p>
                                                                &nbsp;&nbsp;
                                                                {foo ? <button className="button2" to="/cart"
                                                                    onClick={() => {
                                                                        handleOrder(tempOrderObj);
                                                                    }}>
                                                                    Add To Cart
                                                                </button> : <button className="button2Dis" disabled>
                                                                     Add To Cart
                                                                 </button>}
                                                                <br /><br />
                                                                <br />
                                                            </div>
                                                        );
                                                    //else {
                                                    //     return (
                                                    //         <div key={index}>
                                                    //             <p>Price: {Number(mealsItem.price + mealCost).toFixed(2)}$</p>
                                                    //             &nbsp;&nbsp;
                                                    //             <button className="button2Dis" disabled>
                                                    //                 Add To Cart
                                                    //             </button>
                                                    //             <br /><br />
                                                    //             <br />
                                                    //         </div>
                                                    //     );
                                                    // }
                                                }
                                            })
                                        }
                                    </form>
                                </div>
                            </div>

                        );
                    } else {
                        return (<div key={index}></div>);
                    }
                })
            }
        </div>
    );
}

export default Meals;