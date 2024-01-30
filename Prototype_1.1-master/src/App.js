/*  Components: App

    Functions:
    
    Author: Skylar Riopel

    description:container that is rendered in index to hold all visual app

    Notes:
     */
import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Restaurant from './pages/Restaurant';
import Meals from './pages/Meals';
import Foot from './pages/Foot';
import YourRestaurants from './pages/YourRestaurants';
import ModifyRestaurant from './pages/ModifyRestaurant';
import ModifyMeals from './pages/ModifyMeals';
import ModifyMeal from './pages/ModifyMeal';
import ModifySide from './pages/ModifySide';
import ModifyDrink from './pages/ModifyDrink';
import CreateMeal from './pages/CreateMeal';
import CreateSide from './pages/CreateSide';
import CreateDrink from './pages/CreateDrink';
import CreateRestaurant from './pages/CreateRestaurant';
import Checkout from './pages/Checkout';
import EditMeals from './pages/EditMeals';
import OrderInfo from './pages/OrderInfo';
import Test from './pages/Test';
import { useEffect } from 'react';
//import { gapi } from 'gapi-script';


function App() {
  function handleCallbackResponse(response){
    console.log("Encoded JWT ID token: "+ response.credentials)
  }
  if(sessionStorage.getItem("user") == "null"){
    sessionStorage.setItem("user","");
  }
  // useEffect(() => {
  //     /* global google */
  //     google.accounts.id.initialize({
  //       client_id:"156618138924-guld5hffomtphaj8hpmct2s7n4171al8.apps.googleusercontent.com",
  //       callBack: handleCallbackResponse
  //     });

  //     google.accounts.id.renderButton(
  //       document.getElementById("signInDiv"),
  //       {theme: "outline",size: "large"}
  //     );
  // },[]);

    

  //var accessToken = gapi.auth.getToken().accessToken;

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/restaurants/:id' element={<Restaurant />} />
          <Route path='/meals/:id' element={<Meals />} />
          <Route path='/your-restaurants' element={<YourRestaurants />} />
          <Route path='/modify-restaurant/:id' element={<ModifyRestaurant />} />
          <Route path='/modify-meals/:id' element={<ModifyMeals />} />
          <Route path='/modify-meal/:id' element={<ModifyMeal />} />
          <Route path='/modify-drink/:id' element={<ModifyDrink />} />
          <Route path='/modify-side/:id' element={<ModifySide />} />
          <Route path='/create-meal/:id' element={<CreateMeal />} />
          <Route path='/create-drink/:id' element={<CreateDrink />} />
          <Route path='/create-side/:id' element={<CreateSide />} />
          <Route path='/create-restaurant' element={<CreateRestaurant />} />
          <Route path='/edit-meals/:id' element={<EditMeals />} />
          <Route path='/order-info/:id' element={<OrderInfo />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/test' element={<Test />} />
        </Routes>
        <Foot />
      </Router>
    </>
  );
}

export default App;
