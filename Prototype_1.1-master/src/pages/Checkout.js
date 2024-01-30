/*  Components: Cehckout

    Functions: Private: removeOrder, orderMeal
    
    Author: Skylar Riopel

    description: component to display all meals in cart and give option to buy

    Notes: Currently does not sort by restaurant name? possibly add later.
     */
import React, { useState, useEffect } from "react";
import { RestaurantData } from '../components/RestaurantData';
import { Link } from 'react-router-dom';

function Checkout() {
    window.scrollTo(0, 0);
    var subTotal = 0;
    function removeAllOrders(){
        sessionStorage.setItem("ordersList","[]");
    }

    /*Method to remove a single order from the order list*/ 
    function removeOrder(num){
        var tempOrderArray = JSON.parse(sessionStorage.getItem("ordersList"));
        delete tempOrderArray[num];
        var tempOrderString = JSON.stringify(tempOrderArray).replace("null,","");
        var tempOrderString = tempOrderString.replace(",null","");
        var tempOrderString = tempOrderString.replace("null","");
        sessionStorage.setItem("ordersList",tempOrderString);
    }

    function orderMeal() {
        sessionStorage.setItem("orderedList",sessionStorage.getItem("ordersList"));
        sessionStorage.setItem("ordersList","[]");
    }

    if (sessionStorage.getItem("user") != "") {
        return (
            <div className="restaurants">
                <div className="container1">
                    <h2>Final changes / Cart review</h2>
                    {//Map out all meals in cart

                        JSON.parse(sessionStorage.getItem("ordersList")).map((item, index) => {
                            subTotal += item.price;
                            const myElement = (/* element to print out meal info of each meal in cart*/
                                <div key={index}>
                                    <div className="table">{/* display item number, picture, titles for meal info and meal info*/}
                                        <div className="text-3">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <img className="pic-100" src={item.picture} />
                                            <br />
                                        </div>&emsp;
                                        <div className="flex">
                                            <div >
                                                <div>
                                                    <div className="text-5">Meal Name</div>
                                                </div><br />
                                                {item.drinks.map((x, index) => {/*map out all drink options for printing drinks title*/
                                                    if (index == 0)
                                                        return (<><div className="text-5"><b>Drinks</b></div><br /></>);
                                                    else
                                                        return (<><br /><br /></>);
                                                })}
                                                {item.sides.map((x, index) => {/*map out all drink options  for printing sides title*/
                                                    if (index == 0)
                                                        return (<><div className="text-5"><b>Sides</b></div><br /></>);
                                                    else
                                                        return (<><br /><br /></>);
                                                })}
                                                <div>
                                                    <div className="text-5">Cost</div>
                                                </div><br />
                                            </div>&emsp;
                                            <div>
                                                <div className="text-4">
                                                    {item.name}
                                                </div><br />

                                                {item.drinks.map(x => {/*map out all drink options radio buttons*/
                                                    return (<><div className="text-4">{x.name}</div><br /></>);
                                                })}


                                                {item.sides.map(x => {/*map out all side options radio buttons*/
                                                    return (<><div className="text-4">{x.name}</div><br /></>);
                                                })}

                                                <div className="text-4">
                                                    {item.price}${/*display price of meal with sides and drinks price included */}
                                                </div>
                                            </div><br /><br />
                                        </div><br />
                                    </div>
                                    <form className="left-div">{/*button for removing a singular order */}
                                        <button className="button2"
                                            onClick={() => {
                                                removeOrder(index);
                                            }}>
                                            Remove from Cart
                                        </button>
                                    </form>
                                    <div className="border1" />
                                </div>
                            );
                            /*check if on last meal in order to print subtotal and tax and total and proceed to checkout button and button to remove all from cart */
                            if (index != (JSON.parse(sessionStorage.getItem("ordersList")).length - 1)) {
                                return (
                                    <div key={index}>
                                        {myElement}

                                    </div>
                                )
                            } else {
                                return (
                                    <div key={index}>
                                        {myElement}
                                        <div className='table-1'>
                                            <div className='padding1'>{/*titles for totals information */}
                                                <div align="right">
                                                    Subtotal:
                                                </div>
                                                <div align="right">
                                                    Tax:
                                                </div>
                                                <div align="right">
                                                    Total:
                                                </div>
                                            </div>
                                            <div className='padding-1'>{/*totals information (subtotal, tax and total)*/}
                                                <div>
                                                    {Number(subTotal).toFixed(2)}$
                                                </div>
                                                <div>
                                                    {Number(subTotal * 0.13).toFixed(2)}$
                                                </div>
                                                <div>
                                                    {Number(subTotal * 1.13).toFixed(2)}$
                                                </div>
                                            </div>
                                        </div>
                                        <Link className='button3' to='/cart'>Go back to cart</Link><br/><br/>
                                        <Link className="button2" to='/order-info/1' onClick={() =>{
                                            orderMeal();
                                        }}>
                                            Buy Now
                                        </Link>
                                        <br /><br />
                                    </div>
                                )
                            }
                        }
                        )}
                </div>
            </div>
        );
    } else {
        return (
            <div className="restaurants">
                <div className="container1">
                <h2>Final changes / Cart review</h2>
                    {//Map out all meals in cart

                        JSON.parse(sessionStorage.getItem("ordersList")).map((item, index) => {
                            subTotal += item.price;
                            const myElement = (/* element to print out meal info of each meal in cart*/
                                <div key={index}>
                                    <div className="table">{/* display item number, picture, titles for meal info and meal info*/}
                                        <div className="text-3">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <img className="pic-100" src={item.picture} />
                                            <br />
                                        </div>&emsp;
                                        <div className="flex">
                                            <div >
                                                <div>
                                                    <div className="text-5">Meal Name</div>
                                                </div><br />
                                                {item.drinks.map((x, index) => {/*map out all drink options for printing drinks title*/
                                                    if (index == 0)
                                                        return (<><div className="text-5"><b>Drinks</b></div><br /></>);
                                                    else
                                                        return (<><br /><br /></>);
                                                })}
                                                {item.sides.map((x, index) => {/*map out all drink options  for printing sides title*/
                                                    if (index == 0)
                                                        return (<><div className="text-5"><b>Sides</b></div><br /></>);
                                                    else
                                                        return (<><br /><br /></>);
                                                })}
                                                <div>
                                                    <div className="text-5">Cost</div>
                                                </div><br />
                                            </div>&emsp;
                                            <div>
                                                <div className="text-4">
                                                    {item.name}
                                                </div><br />

                                                {item.drinks.map(x => {/*map out all drink options radio buttons*/
                                                    return (<><div className="text-4">{x.name}</div><br /></>);
                                                })}


                                                {item.sides.map(x => {/*map out all side options radio buttons*/
                                                    return (<><div className="text-4">{x.name}</div><br /></>);
                                                })}

                                                <div className="text-4">
                                                    {item.price}${/*display price of meal with sides and drinks price included */}
                                                </div>
                                            </div><br /><br />
                                        </div><br />
                                    </div>
                                    <form className="left-div">{/*button for removing a singular order */}
                                        <button className="button2"
                                            onClick={() => {
                                                removeOrder(index);
                                            }}>
                                            Remove from Cart
                                        </button>
                                    </form>
                                    <div className="border1" />
                                </div>
                            );
                            /*check if on last meal in order to print subtotal and tax and total and proceed to checkout button and button to remove all from cart */
                            if (index != (JSON.parse(sessionStorage.getItem("ordersList")).length - 1)) {
                                return (
                                    <div key={index}>
                                        {myElement}

                                    </div>
                                )
                            } else {
                                return (
                                    <div key={index}>
                                        {myElement}
                                        <div className='table-1'>
                                            <div className='padding1'>{/*titles for totals information */}
                                                <div align="right">
                                                    Subtotal:
                                                </div>
                                                <div align="right">
                                                    Tax:
                                                </div>
                                                <div align="right">
                                                    Total:
                                                </div>
                                            </div>
                                            <div className='padding-1'>{/*totals information (subtotal, tax and total)*/}
                                                <div>
                                                    {Number(subTotal).toFixed(2)}$
                                                </div>
                                                <div>
                                                    {Number(subTotal * 0.13).toFixed(2)}$
                                                </div>
                                                <div>
                                                    {Number(subTotal * 1.13).toFixed(2)}$
                                                </div>
                                            </div>
                                        </div>
                                        <Link className='button3' to='/cart'>Go back to cart</Link><br/><br/>
                                        {/* <Link className="button2" to='/order-info/1' onClick={() =>{
                                            orderMeal();
                                        }}>
                                            Buy Now
                                        </Link> */}
                                        <br /><br />
                                    </div>
                                )
                            }
                        }
                        )}
                    <h2>You are not logged in</h2><br />
                    <Link className='button3' to='/login'>Login</Link>
                    <br /><br />
                    <h2>Or fill information</h2>
                    <form action="/order-info/1">
                        <br /><br />
                        <label required for="fname">First name:</label>&emsp;
                        <input required type="text" id="fname" name="fname" /><br /><br />
                        <label required for="fname">Last name:</label>&emsp;&nbsp;
                        <input required type="text" id="fname" name="fname" /><br /><br />
                        <label required for="fname">Email:</label>&emsp;&emsp;&emsp;
                        <input required type="email" id="fname" name="fname" /><br /><br />
                        <Link className='button3' to='/cart'>Go back to cart</Link><br/><br/>
                        <button className="button2"
                            onClick={() => {
                                orderMeal();
                            }}>
                            Buy Now
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Checkout;