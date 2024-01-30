/*  Components: OrderInfo

    Functions: 
    
    Author: Skylar Riopel

    description: to show info of the ordered meal

    Notes:
     */
import React from 'react'
import { Link } from 'react-router-dom';
import logo from './assets/JTS2.png';

function OrderInfo() {
  window.scrollTo(0, 0);
  return (
    <div className='restaurants'>
      <div className='container1'>
        <div>
          <h2>Order being prepared:</h2><br />
          {//Map out all meals in cart

            JSON.parse(sessionStorage.getItem("orderedList")).map((item, index) => {
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
                  <div className="border1" />
                </div>
              );
              /*check if on last meal in order to print subtotal and tax and total and proceed to checkout button and button to remove all from cart */
                return (
                  <div key={index}>
                    {myElement}

                  </div>
                )
            }
            )}
          <p>Time: {JSON.parse(sessionStorage.getItem("orderedList")).length * 13} Minutes</p>
        </div>
      </div>
    </div>
  );
}

export default OrderInfo;