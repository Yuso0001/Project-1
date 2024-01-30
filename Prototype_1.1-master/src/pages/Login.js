/*  Components: Login

    Functions:
    
    Author: Skylar Riopel

    description: login for OAuth

    Notes:
     */
import { GoogleLogin } from 'react-google-login';
import { GoogleLogout } from 'react-google-login';
import React from 'react';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";

//import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import { useState } from 'react';
import { UserData } from '../components/UserData';
import { masKey,reqString,req1String } from ".//Data";

const clientId = "156618138924-guld5hffomtphaj8hpmct2s7n4171al8.apps.googleusercontent.com";



function Login() {
    //if (sessionStorage.getItem("user").length != sessionStorage.getItem("len")) { sessionStorage.setItem("user",""); }
    ////user database connection
    let req = new XMLHttpRequest();
    var tempUsersItems;
    req.onreadystatechange = () => {
        if (req.readyState == XMLHttpRequest.DONE) {
            try{
            tempUsersItems = JSON.parse(req.responseText.substring(10, req.responseText.length - 100));
            }catch (error){

            }
            //console.log(tempUsersItems);
            if (tempUsersItems != null) {
                var userObject = jwt_decode(sessionStorage.getItem("user"));
                ////console.log(tempUsersItems);
                var temp1 = tempUsersItems.find(itm => {
                    return itm.username == userObject.sub;
                });
                if(temp1 != null){
                    sessionStorage.setItem("userData",JSON.stringify(temp1));
                }
                else if (userObject.sub != null && temp1 == null) {
                    var tempObj = 
                        {
                            "username": userObject.sub,
                            "favorites": [],
                            "restaurants": []
                        };
                    sessionStorage.setItem("userData",JSON.stringify(tempObj));
                    tempUsersItems.push(tempObj);
                    req.open("PUT", "https://api.jsonbin.io/v3/b/"+req1String, true);
                    req.setRequestHeader("Content-Type", "application/json");
                    req.setRequestHeader("X-Master-Key", masKey);
                    req.send(JSON.stringify(tempUsersItems));
                }
            }
        }
    };

    req.open("GET", "https://api.jsonbin.io/v3/b/"+req1String+"/latest", true);
    req.setRequestHeader("X-Master-Key", masKey);
    req.send();
    ////////

    const [user, setUser] = useState({});
    // if(sessionStorage.getItem("user") == ""){
    //     // var userObject = jwt_decode(sessionStorage.getItem("user"));
    //      //console.log("wowowow");
    //     // setUser(userObject);
    //     sessionStorage.setItem("user","");
    //     //if(user != )
    // }

    function handleResponse(response) {
        //console.log("Encoded JWT ID token: " + response.credential);
        var userObject = jwt_decode(response.credential);
        sessionStorage.setItem("user", response.credential);
        setUser(userObject);
        //check if user has logged in before
        var temp = UserData.find(itm => {
            itm.id = userObject.sub;
        });
        if (temp == null) {
            //add new user
            const newUser = {
                "username": userObject.sub,
                "favorites": [],
                "restaurants": []
            }
            UserData[UserData.length] = newUser;
            //console.log(UserData);
        }
    };

    function handleSignOut(event) {
        sessionStorage.setItem("user", "");
        //sessionStorage.setItem("len",0);
        //document.getElementById("signInDiv").hidden = false;
        //setUser({});
        window.location.reload(false);
    }
    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "156618138924-guld5hffomtphaj8hpmct2s7n4171al8.apps.googleusercontent.com",
            callback: handleResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large" }
        );
    }, []);

    
    if (true) {
        var ob = null;
        if (sessionStorage.getItem("user") != "") {

            try {
                ob = jwt_decode(sessionStorage.getItem("user"));
            } catch (err) {
                sessionStorage.setItem("user", "");
            }
        }
        return (
            <div data-testid="login" className='login'>
                <div className='container1' >{/*login page*/}
                    <br /><br />{ob != null?<h3>Logout</h3>:<h3>Login</h3>}<br /><br />
                    <div className='center1'>
                    {ob == null && <div id="signInDiv" />}</div>
                    {/* Object.keys(user).length != 0 */}
                    {/* Show login info if logged in else give option to log in */}
                    {ob != null != "" &&
                        <div >
                            <img src={ob.picture} />
                            <p>{ob.name}</p>
                             <p>{ob.email}</p>
                        </div>
                    }<br/><br/>
                    {ob != null &&
                        <button onClick={(e) => handleSignOut(e)}>SignOut</button>
                    }
                    <br /><br /><br /><br />
                </div>
            </div>
        );
    } else {
        return (
            <div data-testid="login" className='login'>
                <div className='container1' >{/*temporary login page*/}
                    <br /><br /><br /><br />
                </div>
            </div>
        );
    }
}

export default Login;