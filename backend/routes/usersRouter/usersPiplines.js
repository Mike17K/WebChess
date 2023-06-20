import crypto from 'crypto';
import jwt_decode from "jwt-decode";


const usersApi = await import('../../api/usersApi.js');

////////////////////////////////
//      getMyProfilePipe      //
////////////////////////////////

async function validateAccessKey(userId,token,callback){
    // check if there is this token in the userId
    const isValid = await usersApi.profileTokenValidation({userId:userId,token:token});

    if(!isValid) return;  // tell the client that there is a server error with the accesskey
    callback();
}

async function sendProfile(req,res){
    const userId = req.body.userId;

    // get user data
    const userProfile = await usersApi.getProfile({userId:userId,userMode:"OWNER"});

    // send user data
    res.json(userProfile);
}

export const getMyProfilePipe = [(req,res,next)=>validateAccessKey(req.body.userId,req.headers['access_server_key'],next),sendProfile];


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

async function checkTokenWithProvider(req,res,next){
    const provider = req.headers['provider'];
    
    if(provider === "Google"){
        const token = req.headers['token'];
        
        const decoded = jwt_decode(token);
        const {email,aud,iss} = decoded;
        
        if(iss !== 'https://accounts.google.com') return res.sendStatus(400); // validate iss
        
        // serch in database for account with this email and id of aud
        const user = await usersApi.findUser({where: {AND: [{ email: email },{ aud:aud },],},});
        
        if(!user) return res.sendStatus(400);
        
        req.userId = user.id;

        next();
        return
    }else if(provider === "Discord"){
        // const token = req.headers['token']; // this will probably be the code
        // TODO // fetching from if the provider discord has aproved this key
        
        // validate that the user of the provider is the same with this one in the base they will have the same id
        // if they dont redirect to register page
        
        next();
        return
    }else if(provider === "Github"){
        // const token = req.headers['token']; // this will probably be the code
        // TODO
        next();
        return
    }

}

async function generateToken(req,res){
    const access_server_key = crypto.randomBytes(64).toString('hex');
    const ttl = 2000000;
    const userId = req.userId;
    const status = await usersApi.setToken(userId,access_server_key,ttl);

    if(status){
        res.json({access_server_key:access_server_key,ttl:ttl,userId:userId});
        return;
    }
    res.sendStatus(400);
}

export const getTokenPipe = [checkTokenWithProvider,generateToken];