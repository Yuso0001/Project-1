/*  Components: Home

    Functions: Public: compareStrings
    
    Author: Skylar Riopel

    description: Home page to quickly get to wanted and popular pages

    Notes: Sort by distance and categories not implemented yet
     */
import React from 'react';
import { RestaurantData } from '../components/RestaurantData';
import { Categories } from '../components/Categories';
import { Link } from 'react-router-dom';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import { masKey,reqString,req1String } from ".//Data";

function Home() {
    //restaruant database connection
    let req = new XMLHttpRequest();
    var temp;
    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            temp = req.responseText.substring(10, req.responseText.length - 100);
            if (sessionStorage.getItem("restaurants") != temp && temp != "") {
                //console.log(temp);
                sessionStorage.setItem("restaurants", temp);
                window.location.reload();
            }
        }
    };

    req.open("GET", "https://api.jsonbin.io/v3/b/"+reqString+"/latest", true);
    req.setRequestHeader("X-Master-Key", masKey);
    req.send();
    temp = JSON.parse(sessionStorage.getItem("restaurants"));
    ////////
    window.scrollTo(0, 0);

    var tempRestaurantData = JSON.stringify(temp.sort((a, b) => { return compareStrings(a.name, b.name); }));/*Alphabetically sorted */
    tempRestaurantData = JSON.parse(tempRestaurantData);

    var tempRestaurantData1 = JSON.stringify(temp.sort((a, b) => { return a.orders - b.orders; }).reverse());/*Sorted by amt of orders */
    tempRestaurantData1 = JSON.parse(tempRestaurantData1);

    var amtOfPop = 6;/*amount of buttons to print for popular and restaurants near you */
    if (temp != null && temp != "") {
        return (
            <div data-testid="home" className='left200'>
                <div className='home'>
                    <br />
                    <div className='container1'>
                        <div className='text-1'>Popular Restaurants:</div>
                        <div className="grid_fit">
                            {
                                tempRestaurantData1.map((item, index) => {/*map out amtOfPop amount of restaurants starting from most popular */
                                    if (index < amtOfPop) {
                                        return (
                                            <div key={index} className='center1'>
                                                <div className='res-text max200'>
                                                    <Link className="button3" to={'/restaurants/' + item.id}>{/*Button to redirect to restaurant page */}
                                                        <img className="small-image" src={item.pic} />
                                                    </Link>
                                                    <div className="button-text">{item.name.replace("\"", "\'")}</div>{/*Display Restaurant name */}
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            }
                        </div>
                    </div>

                    <br />
                    <div className='container1'>
                        <div className='text-1'> Restaurants Near You (WIP):</div>
                        <div className="grid_fit">
                            {
                                tempRestaurantData.map((item, index) => {/*map out amtOfPop amount of restaurants alphabetically(will change later)*/
                                    if (index < amtOfPop) {
                                        return (
                                            <div className='center1' key={index}>
                                                <li key={index} className='res-text max200'>
                                                    <Link className="button3" to={'/restaurants/' + item.id}>{/*Button toi redirect to restaurant page */}    {/*Display Restaurant image */}
                                                        <img className="small-image" src={item.pic} />
                                                    </Link>
                                                    <div className='button-text'>{item.name.replace("\"", "\'")}</div>{/*Display Restaurant name */}
                                                </li>
                                            </div>
                                        );
                                    }
                                })
                            }
                        </div>
                    </div>

                    <br />

                    <div className='container1'>
                        <div className='text-1'> Categories (WIP):</div>
                        <div className="grid_fit">
                            {/*map out all categories might at if for amtOfPop if wanted later */
                                Categories.map((item, index) => {
                                    //RestaurantData.sort((a, b) => { return a.orders - b.orders; });
                                    return (
                                        <div className='center1' key={index}>
                                            <div key={index} className='res-text max200'>
                                                <Link className='button3' to='/restaurants'>
                                                    {/*Display Restaurant image */}
                                                    <img className="small-image" src={item.icon} />
                                                </Link>
                                                <div className='button-text'>
                                                    {item.name}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <br /><br />
                </div>
            </div>
        );
    } else {
        return (
            <div className='home'>
                <br />
                <div className='container1'>
                    Loading...
                </div>
            </div>
        );
    }
}

export default Home;

/*method to alphabetically compare strings
returns : -1 if second word is "bigger" than the first, 1 if the opposite, and 0 if the same word */
export function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}