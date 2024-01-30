/*  Components: Foot

    Functions:
    
    Author: Skylar Riopel

    description: display for foot. Just general information

    Notes: Will need to have real information eventually
     */
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import logo from './assets/JTS2.png';

function Test() {
  // let req = new XMLHttpRequest();
  // var temp;
  // req.onreadystatechange = () => {
  //   if (req.readyState == XMLHttpRequest.DONE) {
  //     temp = req.responseText.substring(10,req.responseText.length-100);
  //     if(sessionStorage.getItem("restaurants")!=temp && temp != ""){
  //       console.log(temp);
  //       sessionStorage.setItem("restaurants",temp);
  //       window.location.reload();
  //     }
  //   }
  // };

  // req.open("GET", "https://api.jsonbin.io/v3/b/62d87906248d43754ffd0ca1/latest", true);
  // req.setRequestHeader("X-Master-Key", "$2b$10$d5X3Rd2W72FyKw0CIILgz.pyYbuomRjia.tCTXKCpW1k8Idu9WxxG");
  // req.send();
  // temp = JSON.parse(sessionStorage.getItem("restaurants"));
  // if(temp != null && temp != ""){
  //   return (
  //       <div className='restaurants'>
  //         <div className='container1'>
  //           {temp.map(item =>{
  //             return(
  //               <div>
  //                   {item.name.replace("\"","\'")}<br/>
  //                   {item.description}<br/>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       </div>
  //   );
  // }else{
    return(
      <div className='restaurants'>
      <div className='container1'>
        Loading...
      </div>
    </div>
    )
  //}
}

export default Test; 