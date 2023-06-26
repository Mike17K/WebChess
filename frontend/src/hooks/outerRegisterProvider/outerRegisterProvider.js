import React from 'react';

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
            console.log(response);
        }).catch(err => {
            console.log(err)
        }
        );
    }

    return [createUserCallback];
}