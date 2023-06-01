import { validateUser, addUser, deleteUser, addEvent, deleteEvent, addPost, deletePost, addComment, deleteComment, addRespond, deleteRespond, addReaction, deleteReaction } from './db_functions.mjs';
import { connect, disconnect } from './database.mjs';

connect().then((res) => {
    if (res) {
        // ok | addUser('NewUser', 'newpassword').then(res=>{console.log(res));
        // ok | validateUser({username: 'NewUser', password: 'newpassword'}).then(res=>console.log(res));
        // ok | deleteUser(1).then(res=>console.log(res));

        disconnect(); // to end the test put this in the then of the last function
    }
}
);
