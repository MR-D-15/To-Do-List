const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine" , "ejs");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery" , false);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: {
        type: String
    }
});


const Item = mongoose.model("Item" , itemsSchema);

const item1 = new Item({
    name: "Welcome to To-Do-List"
});

const item2 = new Item({
    name: "Add Work by Clicking the '+' Button"
});

const item3 = new Item({
    name: "<-- Delete by Checking the Box"
});

const defaultItems = [item1, item2, item3]; 
 
app.get("/" , function(req,res){    
    const currentDay = date.getDate();
    
    Item.find({} , function(err, foundItems){
        if(err){
            console.log(err);
        } else {
            if(foundItems.length === 0) {
               Item.insertMany(defaultItems);     
               res.redirect("/");       
            }
            res.render("list" , {listTitle: currentDay, items: foundItems});
        }
    });       
});

app.post("/" , function(req,res){
    let newItem = req.body.item;
    
    const addItem = new Item({
        name: newItem
    });
    addItem.save();
    res.redirect("/");
});

app.post("/delete", function(req, res){
    Item.deleteOne({_id: req.body.checkBox}, function(err, checkedItem){
        if(err){
            console.log(err);
        } else {
            console.log("Successfully Deleted");
        }
    });
    res.redirect("/");
})

app.listen(3000 , function(){
    console.log("Server is running at port 3000.");
})