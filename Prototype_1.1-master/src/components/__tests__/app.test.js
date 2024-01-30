import { render, screen, cleanip } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RestaurantData } from '../RestaurantData';
import { UserData } from '../UserData';
import { compareStrings } from "../../pages/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Home from '../../pages/Home';
import Restaurants from '../../pages/Restaurants';
import Cart from '../../pages/Cart';
import Login from '../../pages/Login';
import Restaurant from '../../pages/Restaurant';
import Meals from '../../pages/Meals';
import Foot from '../../pages/Foot';

//to fix jest error
window.scrollTo = jest.fn();

//test method to test if it is sorting alphabetically
test('Sort Alpabetically', () => {
  var pass = true;
  var curName = 0;
  RestaurantData.sort((a, b) => { return compareStrings(a.name, b.name); })
  for (var i = 0; i < RestaurantData.length; i++) {
    if (curName != 0) {
      if (curName > RestaurantData[i].name) {
        pass = false;
      }
    } else {
      curName = RestaurantData[i].name;
    }
  }
  expect(pass).toBe(true);
});

//test method to test if sorted by restaurant popularity is working correctly
test('Sort by Popularity for restaurants', () => {
  var pass = true;
  var curAmt = -1;
  RestaurantData.sort((a, b) => { return a.orders - b.orders; }).reverse();
  for (var i = 0; i < RestaurantData.length; i++) {
    if (curAmt != -1) {
      if (curAmt <= RestaurantData[i].orders) {
        pass = false;
        break;
      }
    } else {
      curAmt = RestaurantData[i].orders;
    }
  }
  expect(pass).toBe(true);
});

//test method to test sorting for meal popularity
test('Sort by Popularity for meals', () => {
  var pass = true;
  var curAmt = -1;
  for (var i = 0; i < RestaurantData.length; i++) {
    RestaurantData[i].meals.sort((a, b) => { return a.sales - b.sales; }).reverse();
  }
  for (var i = 0; i < RestaurantData.length; i++) {
    for (var y = 0; y < RestaurantData[i].meals.length; y++) {
      if (curAmt != -1) {
        if (curAmt <= RestaurantData[i].meals[y].sales) {
          pass = false;
          break;
        }
      } else {
        curAmt = RestaurantData[i].meals.sales;
      }
    }
  }
  expect(pass).toBe(true);
});

//test for printing to page and following JSON storage bin convention cannot contain ' in JSON
test('Test replacing \" with \'', () => {
  var pass = true;
  var curAmt = -1;
  for (var i = 0; i < RestaurantData.length; i++) {
    RestaurantData[i].name = RestaurantData[i].name.replace("\"", "\'");
    if (RestaurantData[i].name.includes("\"")) {
      pass = false;
    }
  }
  expect(pass).toBe(true);
});

//test for nulls in json database
test('Test if any items in RestaurantData are null and is correct size', () => {
  expect(RestaurantData.length == 11).toBe(true);
  for(var i = 0; i < RestaurantData.length;i++){
    expect(RestaurantData[i].name != null).toBe(true);
    expect(RestaurantData[i].description != null).toBe(true);
    expect(RestaurantData[i].address != null).toBe(true);
    expect(RestaurantData[i].pic != null).toBe(true);
    expect(RestaurantData[i].orders != null).toBe(true);
    expect(RestaurantData[i].description != null).toBe(true);
    for(var y = 0;y<RestaurantData[i].drinks.length;y++){
      expect(RestaurantData[i].drinks[y].name  != null).toBe(true);
      expect(RestaurantData[i].drinks[y].dPriceDiff  != null).toBe(true);
    }
    for(var y = 0;y<RestaurantData[i].sides.length;y++){
      expect(RestaurantData[i].sides[y].name  != null).toBe(true);
      expect(RestaurantData[i].sides[y].sPriceDiff  != null).toBe(true);
    }
    for(var y = 0;y<RestaurantData[i].meals.length;y++){
      //console.log(RestaurantData[i].name+ " " +RestaurantData[i].meals[y].name);
      expect(RestaurantData[i].meals[y].name  != null).toBe(true);
      expect(RestaurantData[i].meals[y].description  != null).toBe(true);
      expect(RestaurantData[i].meals[y].price  != null).toBe(true);
      expect(RestaurantData[i].meals[y].mealType  != null).toBe(true);
      expect(RestaurantData[i].meals[y].picture  != null).toBe(true);
      expect(RestaurantData[i].meals[y].sales  != null).toBe(true);
      expect(RestaurantData[i].meals[y].amtOfDrinks  != null).toBe(true);
      expect(RestaurantData[i].meals[y].amtOfSides  != null).toBe(true);
    }
  }
});

test('Test modification of RestaurantData', () => {
  //window.location.reload(false);
  var test = Object.assign({}, RestaurantData[0]);
  test.id = (Number(RestaurantData[0].id)+1).toString();
  test.name = "test";
  test.description = "test1";
  test.drinks[0].name = "test2";
  expect(test.id).toBe("32645");
  expect(test.name).toBe("test");
  expect(test.description).toBe("test1");
  expect(test.drinks[0].name).toBe("test2");
});



test('Test creation of meal for Restaurant Data', () => {
  //window.location.reload(false);
  var test = Object.assign({}, RestaurantData[0]);
  test.meals[0].id = (Number(test.meals[0].id)+1).toString();
  test.meals[0].name = "test";
  test.meals[0].description = "test1";
  expect(test.meals[0].id).toBe("10003");
  expect( test.meals[0].name).toBe("test");
  expect( test.meals[0].description).toBe("test1");
});

test('Test creation of drink for Restaurant Data', () => {
  //window.location.reload(false);
  var test = Object.assign({}, RestaurantData[0]);
  test.drinks[0].id = (Number(test.meals[0].id)+1).toString();
  test.drinks[0].name = "test";
  expect(test.meals[0].id).toBe("10003");
  expect( test.meals[0].name).toBe("test");
});

test('Test creation of side for Restaurant Data', () => {
  //window.location.reload(false);
  var test = Object.assign({}, RestaurantData[0]);
  test.sides[0].id = (Number(test.sides[0].id)+1).toString();
  test.sides[0].name = "test";
  expect(test.sides[0].id).toBe("20002");
  expect( test.sides[0].name).toBe("test");
});

test('Test modification of restaurant for Restaurant Data', () => {
  //window.location.reload(false);
  var test = Object.assign({}, RestaurantData[0]);
  test.id = (Number(RestaurantData[0].id)+1).toString();
  test.name = "test";
  test.description = "test1";
  expect(test.id).toBe("32645");
  expect(test.name).toBe("test");
  expect(test.description).toBe("test1");
});

test('Test modification of meal for Restaurant Data', () => {
  //window.location.reload(false);
  var test = Object.assign({}, RestaurantData[0]);
  test.meals[0].name = "test";
  test.meals[0].description = "test1";
  test.meals[0].amtOfDrinks = 2;
  expect( test.meals[0].name).toBe("test");
  expect( test.meals[0].amtOfDrinks).toBe(2);
});

test('Test modification of drink for Restaurant Data', () => {
  //window.location.reload(false);
  var test = Object.assign({}, RestaurantData[0]);
  test.drinks[0].name = "test";
  test.drinks[0].dPriceDiff = 2.99;
  expect( test.meals[0].name).toBe("test");
  expect(test.drinks[0].dPriceDiff ).toBe(2.99);
});

test('Test modification of side for Restaurant Data', () => {
  //window.location.reload(false);
  var test = Object.assign({}, RestaurantData[0]);
  test.sides[0].name = "test";
  test.sides[0].sPriceDiff = 2.99;
  expect( test.sides[0].name).toBe("test");
  expect( test.sides[0].sPriceDiff).toBe(2.99);
});

test('Test adding a favorite', () => {
  var test = {"id":"54321"};
  UserData[1].favorites.push(test);
  var test1 = UserData[1].favorites[1].id == test.id;
  expect(test1).toBe(true);
});

test('Find max id for meal', () => {
  var max = 0;
  var temp = [];
  RestaurantData[0].meals.map((itm,indx)=>{
    temp.push(itm.id);
    if(max < Number(itm.id)){
      max = Number(itm.id);
    }
  });
  var pass = Math.max(...temp) == max;
  expect(pass).toBe(true);
});

test('Find max id for restaurant', () => {
  var max = 0;
  var temp = [];
  RestaurantData.map((itm,indx)=>{
    temp.push(itm.id);
    if(max < Number(itm.id)){
      max = Number(itm.id);
    }
  });
  var pass = Math.max(...temp) == max;
  expect(pass).toBe(true);
});

//testing initialization of cart object and render of home page
// test('Test cart initialization and home+navbar rendering', () => {
//   render(<>
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path='/' exact element={<Home />} />
//       </Routes>
//       <Foot />
//     </Router>
//   </>);
//   expect(sessionStorage.getItem("ordersList")).toBe("[]");//test cart object
//   const navbarElement = screen.getByTestId("navbar");
//   const homeElement = screen.getByTestId("home");

//   expect(navbarElement).toBeInTheDocument();//test render
//   expect(homeElement).toBeInTheDocument();//test render
// });
// //testing initialization of cart object and render of restaurants page
// test('Test cart initialization and restaurants+navbar rendering', () => {
//   render(<>
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path='/' element={<Restaurants />} />
//       </Routes>
//       <Foot />
//     </Router>
//   </>);
//   expect(sessionStorage.getItem("ordersList")).toBe("[]");//test cart object
//   const navbarElement = screen.getByTestId("navbar");
//   expect(navbarElement).toBeInTheDocument();//test render
//   const restaurantsElement = screen.getByTestId("restaurants");
//   expect(restaurantsElement).toBeInTheDocument();//test render
// });
// //testing initialization of cart object and render of restaurant page
// test('Test cart initialization and restaurant+navbar rendering', () => {
//   render(<>
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path='/' element={<Restaurant />} />
//       </Routes>
//       <Foot />
//     </Router>
//   </>);
//   expect(sessionStorage.getItem("ordersList")).toBe("[]");//test cart object
//   const navbarElement = screen.getByTestId("navbar");
//   expect(navbarElement).toBeInTheDocument();//test render
//   const restaurantElement = screen.getByTestId("restaurant");
//   expect(restaurantElement).toBeInTheDocument();//test render
// });
// //testing initialization of cart object and render of meals page
// test('Test cart initialization and meals+navbar rendering', () => {
//   render(<>
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path='/' element={<Meals />} />
//       </Routes>
//       <Foot />
//     </Router>
//   </>);
//   expect(sessionStorage.getItem("ordersList")).toBe("[]");//test cart object
//   const navbarElement = screen.getByTestId("navbar");
//   expect(navbarElement).toBeInTheDocument();//test render
//   const mealsElement = screen.getByTestId("meals");
//   expect(mealsElement).toBeInTheDocument();//test render
// });
// //testing initialization of cart object and render of cart page
// test('Test cart initialization and cart+navbar rendering', () => {
//   render(<>
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path='/' element={<Cart />} />
//       </Routes>
//       <Foot />
//     </Router>
//   </>);
//   expect(sessionStorage.getItem("ordersList")).toBe("[]");//test cart object
//   const navbarElement = screen.getByTestId("navbar");
//   expect(navbarElement).toBeInTheDocument();//test render
//   const cartElement = screen.getByTestId("cart");
//   expect(cartElement).toBeInTheDocument();//test render
// });
// //testing initialization of cart object and render of login page
// test('Test cart initialization and login+navbar rendering', () => {
//   render(<>
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path='/' element={<Login />} />
//       </Routes>
//       <Foot />
//     </Router>
//   </>);
//   expect(sessionStorage.getItem("ordersList")).toBe("[]");//test cart object
//   const navbarElement = screen.getByTestId("navbar");
//   expect(navbarElement).toBeInTheDocument();//test render
//   const loginElement = screen.getByTestId("login");
//   expect(loginElement).toBeInTheDocument();//test render
// });