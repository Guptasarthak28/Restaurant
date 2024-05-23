const express = require('express')
const router = express.Router();
const Person = require('./../models/Person');
const {jwtAuthMiddleware,generateToken} = require('./../jwt')

//POST route to add a person
router.post('/signup',async(req,res) =>{
    try{
const data = req.body;

// Create a new person model using the mongoose model
const newPerson = new Person(data);

//Save the new perosn to the database
 const response = await newPerson.save();
console.log('data saved');

const payload = {
    id:response.id,
    username:response.username
}
console.log(JSON.stringify(payload));
const token = generateToken(payload);
console.log("Token is", token);

res.status(200).json({response: response, token: token});
    }
    catch(err){
console.log(err);
res.status(500).json({error:'Internal Server error'});
    }

});

//login Route
router.post('/login',async(req,res) =>{
    try{
// Extract the username and password
 const {username,password} = req.body;
 
 // Find the user by username
 const user = await Person.findOne({username: username});

 // if user does not exist or password does not match , return error
 if(!user || !(await user.comparePassword(password ))){
    res.status(401).json({error:'Invalid username or password'});
 }

 //Genearate token
 const payload  = {
    id: user.id,
    username: user.username
 }

 const token = generateToken(payload);
 // return token as response
 res.json({token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server error'});
    }
})

// Profile route
router.get('/profile',jwtAuthMiddleware, async(req,res) =>{
    try{
        const userData = req.user;
        console.log('UserData ;', userData);
        const userId = userData.id;
        const user = await Person.findById(userId);
        res.status(200).json({user});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server error'});
    }
})

// GET method to get the person
router.get('/',jwtAuthMiddleware,async(req,res) =>{
    try{
const data = await Person.find();
console.log('data fetched');
res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server error'});
    }
});

router.get('/:workType', async(req,res)=>{
    try{
    const workType = req.params.workType;
    if(workType == 'chef' || workType == 'waiter' || workType == 'manager'){
const response = await Person.find({work:workType});
console.log('response fetched');
res.status(200).json(response);
    }
    else{
    res.status(404).json({error:'Invalid workType'});
    }
}
catch(err){
    console.log(err);
    res.status(500).json({error:'Internal Server error'});
}
});

//Update the data
router.put('/:id',async(req,res)=>{
    try{
const personId = req.params.id;
const updatedPersonData = req.body;
const response = await Person.findByIdAndUpdate(personId, updatedPersonData,{
    new: true, // Return the updated document
    runValidators: true
})

if(!response){
return res.status(404).json({error:'Person not found'});
}

console.log('data updated');
res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server error'});
    }
});

router.delete('/:id',async(req,res) =>{
    try{
const personId = req.params.id;

const response = await Person.findByIdAndDelete(personId);

if(!response){
    return res.status(404).json({error:'Person not found'});
    }

    console.log('data deleted');
res.status(200).json({message:'Person deleted successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server error'});
    }
})

module.exports= router;
