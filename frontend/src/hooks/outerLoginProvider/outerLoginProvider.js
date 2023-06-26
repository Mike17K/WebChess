import React from 'react'
import {store} from "../../redux/store"


const updateProfile = (data) => store.dispatch({type:"setProfile",profile:data})
const clearProfile = (data) => store.dispatch({type:"clearProfile",profile:data})
const setProfile = (data) => store.dispatch({type:"setProfile",profile:data})

// This component is used to handle the login and logout process for all the auth providers
export default function outerLoginProvider(props) {
    
    function revokeServerToken(callback=()=>{}) {
        const session = store.getState();

        if(session === null) return;
        if(session === {}) return;
        if(session.provider === undefined) return;
        if(session.profile.profile === undefined) return;
        if(session.access_server_key === undefined) return;
        if(session.profile.id === undefined) return;
    
        // revoke the access tocken from server
        fetch('http://localhost:5050/api/users/token',{
            method:"DELETE",
            headers: {
                'token': session.access_server_key,
                'userid': session.profile.id
            }}).then(response =>{
                if(!response.ok){
                    console.log("Something went wrong");
                    return;
                } 
                callback();
                props.clearProfile();
                console.log("Logged out")
            }).catch(err=> {
                console.log("Logout error: ",err)
            }
        );
    
    }
    
    function getServerAccessTocken(code,callback=(data)=>{}) {
        console.log("Getting access tocken from server");
        fetch('http://localhost:5050/api/users/token',{
            method:"GET",
            headers: {
                'code': code,
                "provider":props.provider
            }
            }).then(data => data.json()).then(data =>{
                // get access key from server
                updateProfile({access_server_key:data.access_server_key,id:data.userId});
                callback(data);
                }).catch(err=> {
                    console.log(err)
                }
            );
    }
    
    // get profile data from server
    function fetchMyProfile(access_server_key,userId,callback=()=>{}) {
        // fetching users profile 
        fetch(`http://localhost:5050/api/users/profile/${userId}/me`,{
            method:"GET",
            headers: {
                'access_server_key': access_server_key,
            }
        }).then(data => data.json()).then(profile =>{
            // got the profile data from server
            setProfile(profile);
            callback();
        }).catch(err=> {
            console.log(err)
            // if the profile cant be accessed remove it from session
            clearProfile();
        });
    }

    
    // sign out function 
    function signOut(callback=()=>{}) {
        revokeServerToken(callback);
    }    

    // this function is called when the redirect uri is called with an auth code and we pass the code to the server to get the access tocken and fetch the profile data
    async function getProfileCallback({code},callback=()=>{}) {
        getServerAccessTocken(code,(data)=>{
            const {access_server_key /*,ttl*/ ,userId} = data;
            // FETCH PROFILE DATA  
            fetchMyProfile(access_server_key,userId,callback);
            })
        };
    
    return [store.getState(),signOut, getProfileCallback];
}