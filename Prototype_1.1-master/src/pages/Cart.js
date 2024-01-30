/*  Components: Cart

    Functions: Private: removeAllOrders, removeOrder
    
    Author: Skylar Riopel

    description: component to display all meals in cart

    Notes: Currently does not sort by restaurant name? possibly add later.
     */
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function Cart() {
    window.scrollTo(0, 0);
    function removeAllOrders() {
        sessionStorage.setItem("ordersList", "[]");
    }

    /*Method to remove a single order from the order list*/
    function removeOrder(num) {
        var tempOrderArray = JSON.parse(sessionStorage.getItem("ordersList"));
        delete tempOrderArray[num];
        var tempOrderString = JSON.stringify(tempOrderArray).replace("null,", "");
        var tempOrderString = tempOrderString.replace(",null", "");
        var tempOrderString = tempOrderString.replace("null", "");
        sessionStorage.setItem("ordersList", tempOrderString);
    }

    const queryParams = new URLSearchParams(window.location.search);

    const spec = queryParams.get('descip');
    if (spec != null && spec != "null") {
        var tempOrderArray = JSON.parse(sessionStorage.getItem("ordersList"));
        if (tempOrderArray[tempOrderArray.length - 1].specification != spec) {
            tempOrderArray[tempOrderArray.length - 1].specification = spec;
        }
        if (spec == '') {
            tempOrderArray[tempOrderArray.length - 1].specification = "No Specifications";
        }
        sessionStorage.setItem("ordersList", JSON.stringify(tempOrderArray));
    }

    //variable to hold the subtotal(beforetax) price
    var subTotal = 0;
    if (sessionStorage.getItem("ordersList") != "[]") {/*if cart is not empty */
        try {
            JSON.parse(sessionStorage.getItem("ordersList"));
        } catch (err) {
            sessionStorage.setItem("ordersList", "[]");
            window.location.reload(false);
        }
        return (
            <div data-testid="cart" className='orders'>
                <div className="container1">
                    <div className="text-1">Cart:</div><br />
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
                                                    <div className="text-5">Restaurant Name</div>
                                                </div><br />
                                                <div>
                                                    <div className="text-5">Meal Name</div>
                                                </div><br />
                                                <div>
                                                    <div className="text-5">Meal Description</div>
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
                                                <div>
                                                    <div className="text-5">Specifications</div>
                                                </div><br />
                                            </div>&emsp;
                                            <div>
                                                <div className="text-4">
                                                    {item.restaurantName}
                                                </div><br />
                                                <div className="text-4">
                                                    {item.name}
                                                </div><br />
                                                <div className="text-4">
                                                    {item.description}
                                                </div><br />

                                                {item.drinks.map(x => {/*map out all drink options radio buttons*/
                                                    return (<><div className="text-4">{x.name}</div><br /></>);
                                                })}


                                                {item.sides.map(x => {/*map out all side options radio buttons*/
                                                    return (<><div className="text-4">{x.name}</div><br /></>);
                                                })}

                                                <div className="text-4">
                                                    {item.price}${/*display price of meal with sides and drinks price included */}
                                                </div><br />
                                                <div className="text-4">
                                                    {item.specification}
                                                </div><br />
                                            </div><br /><br />
                                        </div><br />
                                    </div>
                                    <div className="left-div">
                                        <Link to={'/edit-meals/' + item.restId + '_'+ item.mealId +'_'+index} className="button2">
                                            Edit Meal
                                        </Link>
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
                                        <form className="left-div">{/*button to remove all order from cart */}
                                            <button className="button2"
                                                onClick={() => {
                                                    removeAllOrders();
                                                }}>
                                                Remove All from Cart
                                            </button>
                                        </form>
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
                                        <Link className="button2" to='/checkout'>
                                            Proceed to Checkout
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
    } else {/*if cart is empty */
        return (
            <div data-testid="cart" key="1" className='orders'>
                <div className="container1">
                    <h1>Cart:</h1>
                    <br />
                    Cart Is empty
                </div>
            </div>
        );
    }
}

export default Cart;