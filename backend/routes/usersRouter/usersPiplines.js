import crypto from 'crypto';
import jwt_decode from "jwt-decode";


const usersApi = await import('../../api/usersApi.js');

////////////////////////////////
//      getMyProfilePipe      //
////////////////////////////////

async function validateAccessKey(profileId,token,callback){
    if(!profileId) return;
    
    // check if there is this token in the userId
    const isValid = await usersApi.profileTokenValidation({profileId:profileId,token:token});

    if(!isValid) return;  // tell the client that there is a server error with the accesskey
    callback();
}

async function sendProfile(req,res){
    const profileId = req.params.profileId;

    // get user data
    const userProfile = await usersApi.getProfile({profileId:profileId,userMode:"OWNER"});
    
    // send user data
    res.json(userProfile);
}

export const getMyProfilePipe = [(req,res,next)=>validateAccessKey(req.params.profileId,req.headers['access_server_key'],next),sendProfile];


////////////////////////////////
//      deleteTokenPipe      //
////////////////////////////////

async function deleteToken(req,res){
    const token = req.headers['token'];
    const userId = req.headers['userid'];

    if (!userId || !token) return res.sendStatus(400);

    const status = await usersApi.deleteToken(userId,token);
    res.sendStatus(status);
}

export const deleteTokenPipe = [(req,res,next)=>validateAccessKey(req.headers['userid'],req.headers['token'],next),deleteToken];

////////////////////////////////
//       getTokenPipe        //
////////////////////////////////
async function googleHandler(req,res,next){
    const code = req.headers['code'];
        
    const decoded_data = jwt_decode(code);
    const {email,aud,iss} = decoded_data;
    if(!email || !aud || !iss) return res.sendStatus(500);
    
    if(iss !== 'https://accounts.google.com') return res.sendStatus(400); // validate iss
    
    // serch in database for account with this email and id of aud
    const user = await usersApi.findUser({where: {AND: [{ email: email },{ aud:aud },{authProvider:"Google"}],},});
    
    if(!user) return res.sendStatus(500);
    
    req.userId = user.id;

    next();
}
async function discordHandler(req,res,next){
    const code = req.headers['code'];
    if(!code) return res.sendStatus(500);
    // validating the code
    const responce = await fetch(`https://discord.com/api/v10/users/@me`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${code}`
        }
        }).then(responce=>responce.json()).catch(err=>console.log(err));

        if(responce.message === 'Bad credentials'){
        return res.sendStatus(500);
        }
    
    const {id,username} = responce;
    if(!id || !username) return res.sendStatus(500);
    
    // serch in database for account with this email and id of aud
    const user = await usersApi.findUser({where: {AND: [{ id: id },{ name:username },{authProvider:"Discord"}],},});
    
    if(!user) return res.sendStatus(500);
    
    req.userId = user.id;
    
    next();
}
async function githubHandler(req,res,next){
    const code = req.headers['code'];
    // validating the code
    const responce = await fetch(`https://api.github.com/user`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${code}`
        }
    }).then(responce=>responce.json()).catch(err=>console.log(err));
    
    if(responce.message === 'Bad credentials'){
        return res.sendStatus(500)
    }
    
    const {name,node_id} = responce;
    if(!name || !node_id) return res.sendStatus(500);
    
    // serch in database for account with this email and id of aud
    const user = await usersApi.findUser({where: {AND: [{ name: name },{ aud:node_id },{authProvider:"Github"}],},});
    
    if(!user) return res.sendStatus(500);
    
    req.userId = user.id;
    
    next();
}

async function customFormHandler(req,res,next){
    const name = req.headers['name'];
    const password = req.headers['password'];
    if(!name || !password) return res.sendStatus(500);

    // regex test the name and password
    const nameRegex = /^[A-Za-z0-9]+$/;
    const passwordRegex = /^[A-Za-z0-9]+$/;

    const isNameValid = nameRegex.test(name);
    const isPasswordValid = passwordRegex.test(password);

    if (!isNameValid || !isPasswordValid) {
    // Invalid name or password, handle the error or send an appropriate response
    return res.sendStatus(400); // Bad Request
    }
    
    //find user with this name 
    const user = await usersApi.findUser({where: {AND: [{ name: name },{authProvider:"CustomForm"}],},});
    if(!user) return res.sendStatus(500);
    if(!user.salt) return res.sendStatus(500);
    
    // TODO
    // in the register page this is how to make a salt for a user
    // const salt = crypto.randomBytes(16).toString('hex');
    /*
    // register password encryption
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(enteredPassword + user.salt);
    const hashedEnteredPassword = hash.digest('hex');   
    // store the user in the database
    const user = await usersApi.createUser({
        name: enteredName,
        password: hashedEnteredPassword,
        salt: salt,
        authProvider: "CustomForm"
    });    
    */

    // Hash the password
    const hash = crypto.createHash('sha256');
    hash.update(enteredPassword + user.salt);
    const hashedEnteredPassword = hash.digest('hex');
    
    // check if the password is correct
    if(user.password !== hashedEnteredPassword) return res.sendStatus(500);

    req.userId = user.id;

    next();
}

async function checkTokenWithProvider(req,res,next){
    const provider = req.headers['provider'];
    
    if(provider === "Google"){
        googleHandler(req,res,next);
        return
    }else if(provider === "Discord"){
        discordHandler(req,res,next)        
        return
    }else if(provider === "Github"){
        githubHandler(req,res,next)
        return
    }else if(provider === "CustomForm"){
        customFormHandler(req,res,next)
        return
    }

}

async function generateToken(req,res){
    const access_server_key = crypto.randomBytes(64).toString('hex');
    const ttl = 2000000;
    const userId = req.userId;
    const status = await usersApi.setToken(userId,access_server_key,ttl);

    if(status){
        console.log({access_server_key:access_server_key,ttl:ttl,userId:userId});
        res.json({access_server_key:access_server_key,ttl:ttl,userId:userId});
        return;
    }
    res.sendStatus(400);
}

export const getTokenPipe = [checkTokenWithProvider,generateToken];