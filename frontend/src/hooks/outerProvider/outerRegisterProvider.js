import {store} from "../../redux/store"

//const updateProfile = (data) => store.dispatch({type:"updateProfile",profile:data}) 
const clearProfile = (data) => store.dispatch({type:"clearProfile",profile:data})
//const setProfile = (data) => store.dispatch({type:"setProfile",profile:data})

// This component is used to handle the login and logout process for all the auth providers
export default function outerRegisterProvider(props) {

    function createUserCallback(data, callback = (data) => { }) {
        console.log("Submitting code to server");
        console.log(data);
        fetch('http://localhost:5050/api/users/createUser', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                "provider": props.provider
            })
        }).then(response => {
            if(response.ok) {
                window.location.href = 'http://localhost:3000/login';
            }
        }).catch(err => {
            console.log(err)
        }
        );
    }

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
                clearProfile();
                console.log("Logged out")
            }).catch(err=> {
                console.log("Logout error: ",err)
            }
        );
    
    }
    
    // sign out function 
    function signOut(callback=()=>{}) {
        revokeServerToken(callback);
    }    

    return [store.getState(),signOut,createUserCallback];
}