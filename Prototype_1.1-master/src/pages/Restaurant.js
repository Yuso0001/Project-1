/*  Components: Restaurant

    Functions:
    
    Author: Skylar Riopel

    description: display menu for restaurant

    Notes:
     */
import React from 'react';
import { useParams } from 'react-router-dom';
import { RestaurantData } from '../components/RestaurantData';
import '../components/Restaurants.css';
import { Link } from 'react-router-dom';
import { masKey,reqString,req1String } from ".//Data";



//function to return Restaurant view which displays a single restaurant
function Restaurant() {
    window.scrollTo(0, 0);
    let { id } = useParams();
    var tempArr = [];
    var popularArr = [];
    var mealsArr = [];
    var cnt = 0;
    var cnt1 = 0;
    var amtOfPop = 6;
    var mealTypeSet = new Set();
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

    return (
        <div data-testid="restaurant" className='restaurant'>
            <Link className='button3' to={'/restaurants'} onClick={() => {window.scrollTo(0, 0);}}>Go back to all restaurants</Link><br/><br/>
            <br />
            {
                tempRestsItems.map((item, index) => {
                    {/* thisthere */}
                    if (item.id == id) {
                        item.meals.map((mealItem) =>{
                            popularArr.push(mealItem);
                            mealsArr.push(mealItem);
                        });
                        return (
                            <div key={index} className="centered">
                                <div className="container1">
                                    <div className="text-1"> {item.name.replace("\"","\'")}</div><br />{/*Display restaurant name*/}
                                    <div className='text-2'><b>Description:</b> {item.description}</div>{/*Display restaurant description*/}
                                    <div className='text-2'><b>Address:</b> {item.address}</div>
                                    <br /><br />
                                </div><br/><br/>
                                <div className='container1'>
                                    <div className="text-1 container4">Popular:</div><br />
                                    <div className='grid_fit'>
                                        {
                                            //does not return anything just pushing all sales numbers to array
                                            item.meals.map((item1, index) => {
                                                tempArr.push(item1.sales);
                                            })
                                        }
                                        {
                                            popularArr.map((item1, index) => {
                                                if (index == 0) {
                                                    popularArr.sort((a, b) => { return a.sales - b.sales; }).reverse();
                                                    tempArr.sort(function (a, b) { return a - b }).reverse();
                                                }
                                            })

                                        }
                                        {
                                            //map all popular meals
                                            popularArr.map((item1, index) => {
                                                if (cnt < amtOfPop) {
                                                    cnt = cnt + 1;
                                                    return (
                                                        <div className="center1" key={index}>
                                                            <div className='up'>
                                                                <div className="container2" key={index}>
                                                                    <div className="container3">{/*Display meal picture*/}
                                                                        <img className="small-image" src={item1.picture} />
                                                                    </div>
                                                                </div>
                                                                <div className='res-text-1'>{/*Display meal information*/}
                                                                    <h4>{item1.name}</h4>
                                                                    <p>Price: {Number(item1.price).toFixed(2)}$</p>
                                                                    {/* thisnow */}
                                                                    <Link onClick={() => {window.scrollTo(0, 0);}} className="button1" to={'/meals/' + item.id + "_" + item1.id}>{/*Link to meal page*/}
                                                                        View Meal
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                    </div>
                                    <div className="border1"/>
                                    {
                                        //map all meals from a single restaurant
                                        mealsArr.map((item1,index) =>{
                                            if(!mealTypeSet.has(item1.mealType)){
                                                mealTypeSet.add(item1.mealType);
                                                var tempMealType = item1.mealType;
                                                //console.log(item1.mealType);
                                                return(
                                                    <>
                                                        <div className='' key={index}>
                                                            <div className='text-1 container5'>
                                                                {item1.mealType}: 
                                                            </div><br />
                                                            <div className='grid_fill-1'>
                                                                <div className="center1" key={index}>
                                                                    <div className='up'>
                                                                        <div className='container2'>{/*Display meal picture*/}
                                                                            <div className="container3">
                                                                                <img className="small-image" src={item1.picture} />
                                                                            </div>
                                                                        </div>
                                                                        <div className='res-text-1'>{/*Display meal information*/}
                                                                            <h4>{item1.name}</h4>
                                                                            <p>Price: {Number(item1.price).toFixed(2)}$</p>
                                                                            {/* thisnow */}
                                                                            <Link onClick={() => {window.scrollTo(0, 0);}} className="button1" to={'/meals/'+item.id+"_"+item1.id}>{/*Link to meal page*/}
                                                                                View Meal
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                mealsArr.map((item2,index2) =>{
                                                                    if(index2 != index && item2.mealType == tempMealType ){
                                                                        return(
                                                                            <div className="center1" key={index}>
                                                                                <div className='up'>
                                                                                    <div className='container2'>{/*Display meal picture*/}
                                                                                        <div className="container3">
                                                                                            <img className="small-image" src={item2.picture} />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='rest-text'>{/*Display meal information*/}
                                                                                        <h4>{item2.name}</h4>
                                                                                        <p>Price: {Number(item2.price).toFixed(2)}$</p>
                                                                                        {/* thisnow */}
                                                                                        <Link onClick={() => {window.scrollTo(0, 0);}} className="button1" to={'/meals/' + item.id + "_" + item2.id}>{/*Link to meal page*/}
                                                                                            View Meal
                                                                                        </Link>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                })
                                                                }
                                                            </div>
                                                            <br/>
                                                        </div>
                                                        <div className="border1"/>
                                                    </>
                                                );
                                            }
                                        })
                                    }
                                </div>
                                <br/><br/>
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

export default Restaurant;