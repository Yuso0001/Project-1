/*  Components: Restaurant

    Functions: Private: handleOrder
    
    Author: Skylar Riopel

    description: display info for certain meal and give sides and drink options

    Notes:Only favorites filtering option works and Distance sort currently does reverse popularity as distance API has not been implemented
     */
import React, { useState, useEffect } from "react";
import { RestaurantData } from '../components/RestaurantData';
import { UserData } from '../components/UserData';
import { compareStrings } from "./Home";
import '../components/Restaurants.css';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { masKey,reqString,req1String } from ".//Data";



function Restaurants() {
    const [tempUsersItems, settempUsersItems] = useState();

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

    /////////
    let req1 = new XMLHttpRequest();
    var tempUsersItem = JSON.parse(sessionStorage.getItem("userData"));
    req1.onreadystatechange = () => {
        if (req1.readyState == XMLHttpRequest.DONE) {
            if ((!req1.responseText.includes("mealType")) && req1.responseText != "") {
                var temp1;
                var temp2 = JSON.parse(sessionStorage.getItem("userData"));
                var temp3;
                if (!req1.responseText.includes("Bin cannot be blank")) {
                    temp3 = JSON.parse(req1.responseText.substring(10, req1.responseText.length - 100));
                }
                if (temp3 != null && temp2 != null) {
                    temp3.find((itm, indx) => {
                        temp1 = indx;
                        return itm.username == temp2.username;
                    });
                }


                if (temp1 != null && JSON.stringify(temp3[temp1]) != JSON.stringify(tempUsersItem)) {
                    temp3[temp1] = tempUsersItem;
                    req1.open("PUT", "https://api.jsonbin.io/v3/b/"+req1String, true);
                    req1.setRequestHeader("Content-Type", "application/json");
                    req1.setRequestHeader("X-Master-Key", masKey);
                    req1.send(JSON.stringify(temp3));
                }
            }


            
        }
    };

    req1.open("GET", "https://api.jsonbin.io/v3/b/"+req1String+"/latest", true);
    req1.setRequestHeader("X-Master-Key", masKey);
    req1.send();
    //////

    var x;
    // window.scrollTo(0, 0);
    var cnt = 0;
    const [favorites, setFavorites] = useState([]);
    const [num, setNum] = useState(0);
    const [num1, setNum1] = useState(0);
    var tempArray = ["Alphabetic", "Popularity", "Distance"];
    var tempArray1 = ["None", "Burgers", "Pizza", "Sandwiches", "Japanese", "Chinese"];
    if (sessionStorage.getItem("user") != "") {
        tempArray1 = ["None", "Burgers", "Pizza", "Sandwiches", "Japanese", "Chinese", "Favorites"];
    }

    useEffect(() => {
        var temp;
        try {
            // Parse a JSON

            //temp = JSON.parse(sessionStorage.getItem("favoritesList"));
            temp = JSON.parse(sessionStorage.getItem("favoritesList"));
            if (temp.length != RestaurantData.length) {
                temp = RestaurantData;
            } else {
                temp = JSON.parse(sessionStorage.getItem("favoritesList"));
            }
        } catch (e) {
            // You can read e for more info
            // Let's assume the error is that we already have parsed the payload
            // So just return that
            temp = RestaurantData;
        }
        if (temp == null) {
            temp = RestaurantData;
        }

        setFavorites(temp);
    }, []);

    useEffect(() => {
    }, [favorites]);

    function handleFavorite(id) {
        var temp = { "id": id };
        try {
            tempUsersItem = JSON.parse(tempUsersItem);
        } catch (error) {

        }
        var testNull = tempUsersItem.favorites.find(itm => {
            return itm.id == id;
        });
        if (testNull == null) {
            tempUsersItem.favorites.push(temp);
        }
        sessionStorage.setItem("userData", JSON.stringify(tempUsersItem));
        setFavorites(temp);
    }

    function removeFavorite(id) {
        var temp;
        try {
            tempUsersItem = JSON.parse(tempUsersItem);
        } catch (error) {

        }
        tempUsersItem.favorites.find((itm, indx) => {
            temp = indx;
            return itm.id == id;
        })
        delete tempUsersItem.favorites[temp];
        var temp1 = JSON.stringify(tempUsersItem);
        temp1 = temp1.replace(",null", "");
        temp1 = temp1.replace("null,", "");
        temp1 = temp1.replace("null", "");
        sessionStorage.setItem("userData", temp1);
        setFavorites(temp1);
    }

    function changeSort(s) {
        setNum(s);
    }

    function changeFilter(s) {
        setNum1(s);
    }

    return (
        <div data-testid="restaurants" className='restaurants'>
            <br />

            <br />
            <div className='container1'>
                <br />
                <form><b>Sort: </b>
                {/* Show all sort items */}
                    <div className="grid_fit">
                        
                        {
                            tempArray.map((item, index) => {
                                if (index == 0) {
                                    return (
                                        <div>
                                            <input defaultChecked type="radio" id="html" name="sort" value="HTML" onClick={() => {
                                                changeSort(index);
                                            }} />
                                            <label for="html">{item}</label>&emsp;
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div>
                                            <input type="radio" id="html" name="sort" value="HTML" onClick={() => {
                                                changeSort(index);
                                            }} />
                                            <label for="html">{item}</label>&emsp;
                                        </div>
                                    );
                                }
                            })
                        }
                    </div>
                    <br />
                </form>
                <div className="border1"/>
                <form><b>Filter:</b>
                {/* Show all filter items */}
                    <div className="grid_fit">
                        {
                            tempArray1.map((item, index) => {
                                if (index == 0) {
                                    return (
                                        <div>
                                            <input defaultChecked type="radio" id="html" name="sort" value="HTML" onClick={() => {
                                                changeFilter(index);
                                            }} />
                                            <label for="html">{item}</label>&emsp;
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div>
                                            <input type="radio" id="html" name="sort" value="HTML" onClick={() => {
                                                changeFilter(index);
                                            }} />
                                            <label for="html">{item}</label>&emsp;
                                        </div>
                                    );
                                }
                            })
                        }
                    </div>
                    <br />
                </form>
            </div>
            <br />
            <div className='container1'>
                <div className="text-1">Restaurants:</div>
                <div className="grid_fill">
                    {[0].map(item => {
                        if (num == 0) {//alphabetic
                            return (
                                tempRestsItems.sort((a, b) => { return compareStrings(a.name, b.name); }).map((item, index) => {
                                    if (num1 == 6) {
                                        return (
                                            <>
                                                {JSON.parse(sessionStorage.getItem("userData")).favorites.map((itm2, indx2) => {
                                                    if (itm2 != null && itm2.id == item.id) {
                                                        return (
                                                            <div className="center1" key={index}>
                                                                <div key={index} className='res-text max200'>
                                                                    <Link className="button3" to={'/restaurants/' + item.id}>{/*Button to redirect to restaurant page */}
                                                                        <img className="small-image" src={item.pic} />
                                                                    </Link>
                                                                    <div className="button-text">{item.name.replace("\"", "\'")}</div>{/*Display Restaurant name */}
                                                                    <button className='width100'
                                                                        onClick={() => {
                                                                            removeFavorite(item.id);
                                                                        }}
                                                                    >
                                                                        Remove From Favorites
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    } else {
                                                        return (<></>);
                                                    }
                                                })}
                                            </>
                                        );
                                    } else {
                                        try {
                                            tempUsersItem = JSON.parse(tempUsersItem);
                                        } catch (error) {

                                        }
                                        var testFav;
                                        if (tempUsersItem != null) {
                                            testFav = tempUsersItem.favorites.find(itm => {
                                                if (itm != null) {
                                                    return itm.id == item.id;
                                                }
                                            });
                                        }
                                        return (
                                            <div className="center1" key={index}>
                                                <div key={index} className='res-text max200'>
                                                    <Link className="button3" to={'/restaurants/' + item.id}>{/*Button to redirect to restaurant page */}
                                                        <img className="small-image" src={item.pic} />
                                                    </Link>
                                                    <div className="button-text">{item.name.replace("\"", "\'")}</div>{/*Display Restaurant name */}
                                                    {testFav == null ?
                                                        <button className='width100'
                                                            onClick={() => {
                                                                handleFavorite(item.id);
                                                            }}
                                                        >
                                                            Add to Favorites
                                                        </button> : <button className='width100'
                                                            onClick={() => {
                                                                removeFavorite(item.id);
                                                            }}
                                                        >
                                                            Remove from Favorites
                                                        </button>}
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            )
                        } else if (num == 1) {//popularity
                            return (
                                tempRestsItems.sort((a, b) => { return a.orders - b.orders; }).reverse().map((item, index) => {
                                    if (num1 == 6) {
                                        return (
                                            <>
                                                {JSON.parse(sessionStorage.getItem("userData")).favorites.map((itm2, indx2) => {
                                                    if (itm2.id == item.id) {
                                                        return (
                                                            <div className="center1" key={index}>
                                                                <div key={index} className='res-text max200'>
                                                                    <Link className="button3" to={'/restaurants/' + item.id}>{/*Button to redirect to restaurant page */}
                                                                        <img className="small-image" src={item.pic} />
                                                                    </Link>
                                                                    <div className="button-text">{item.name.replace("\"", "\'")}</div>{/*Display Restaurant name */}
                                                                    <button className='width100'
                                                                        onClick={() => {
                                                                            removeFavorite(item.id);
                                                                        }}
                                                                    >
                                                                        Remove From Favorites
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                })}
                                            </>
                                        );
                                    } else {
                                        try {
                                            tempUsersItem = JSON.parse(tempUsersItem);
                                        } catch (error) {

                                        }
                                        var testFav
                                        if (tempUsersItem != null) {
                                            testFav = tempUsersItem.favorites.find(itm => {
                                                return itm.id == item.id;
                                            });
                                        }
                                        return (
                                            <div className="center1" key={index}>
                                                <div key={index} className='res-text max200'>
                                                    <Link className="button3" to={'/restaurants/' + item.id}>{/*Button to redirect to restaurant page */}
                                                        <img className="small-image" src={item.pic} />
                                                    </Link>
                                                    <div className="button-text">{item.name.replace("\"", "\'")}</div>{/*Display Restaurant name */}
                                                    {testFav == null ?
                                                        <button className='width100'
                                                            onClick={() => {
                                                                handleFavorite(item.id);
                                                            }}
                                                        >
                                                            Add to Favorites
                                                        </button> : <button className='width100'
                                                            onClick={() => {
                                                                removeFavorite(item.id);
                                                            }}
                                                        >
                                                            Remove from Favorites
                                                        </button>}
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            )
                        } else if (num == 2) {//Distance ** does not currently order by distance   reverse popularity for testing purposes
                            return (
                                tempRestsItems.sort((a, b) => { return a.orders - b.orders; }).map((item, index) => {
                                    if (num1 == 6) {
                                        return (
                                            <>
                                                {JSON.parse(sessionStorage.getItem("userData")).favorites.map((itm2, indx2) => {
                                                    if (itm2.id == item.id) {
                                                        return (
                                                            <div className="center1" key={index}>
                                                                <div key={index} className='res-text max200'>
                                                                    <Link className="button3" to={'/restaurants/' + item.id}>{/*Button to redirect to restaurant page */}
                                                                        <img className="small-image" src={item.pic} />
                                                                    </Link>
                                                                    <div className="button-text">{item.name.replace("\"", "\'")}</div>{/*Display Restaurant name */}
                                                                    <button className='width100'
                                                                        onClick={() => {
                                                                            removeFavorite(item.id);
                                                                        }}
                                                                    >
                                                                        Remove From Favorites
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                })}
                                            </>
                                        );
                                    } else {
                                        try {
                                            tempUsersItem = JSON.parse(tempUsersItem);
                                        } catch (error) {

                                        }
                                        var testFav;
                                        if (tempUsersItem != null) {
                                            var testFav = tempUsersItem.favorites.find(itm => {
                                                return itm.id == item.id;
                                            });
                                        }
                                        return (
                                            <div className="center1" key={index}>
                                                <div key={index} className='res-text max200'>
                                                    <Link className="button3" to={'/restaurants/' + item.id}>{/*Button to redirect to restaurant page */}
                                                        <img className="small-image" src={item.pic} />
                                                    </Link>
                                                    <div className="button-text">{item.name.replace("\"", "\'")}</div>{/*Display Restaurant name */}
                                                    {testFav == null ?
                                                        <button className='width100'
                                                            onClick={() => {
                                                                handleFavorite(item.id);
                                                            }}
                                                        >
                                                            Add to Favorites
                                                        </button> : <button className='width100'
                                                            onClick={() => {
                                                                removeFavorite(item.id);
                                                            }}
                                                        >
                                                            Remove from Favorites
                                                        </button>}
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            )
                        }
                    })}
                </div>
            </div>
            <br />
        </div>
    );
}

export default Restaurants;