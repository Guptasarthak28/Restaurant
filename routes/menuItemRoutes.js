const express = require('express')
const router = express.Router();
const MenuItem = require('./../models/MenuItem');

// POST method to add a menu item
router.post('/' ,async(req,res) =>{
    try{
const data = req.body;
const newMenu = new MenuItem(data);
const response = await newMenu.save();
console.log('Data saved');
res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server error'});
    }
});

// GET method to get the menu Item
router.get('/', async(req,res) =>{
    try{
const data = await MenuItem.find();
console.log('data fetched');
res.status(200).json(data);

    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server error'});
    }
});



module.exports = router;
