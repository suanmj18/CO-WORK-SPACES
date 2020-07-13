var mongoose = require("mongoose");
var Office = require("./models/office");
var Comment = require("./models/comment");

var data= [
        {name :"Office", image : "/images/Office.jpg", description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},

       {name :"Hotdesk", image : "/images/Hotdesk.jpg", description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
        
       {name :"Amphitheatre", image : "/images/Amphi1.jpg", description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
        ];



function seedDB(){
// remove all offices
Office.remove({},function(err){
    if (err){
        console.log(err);
            }
        console.log("removed offices!");

//
data.forEach(function(seed){
    Office.create(seed,function(err,office){
        if(err){
            console.log(err)
            } else {
                console.log("added a office");
                Comment.create( 
                    {
                        text :" This office is great",
                        author : "Sparsh"    
            },function(err,comment){
                if(err){
                    console.log(err);
                    } else {
                      office.comments.push(comment);
                      office.save();
                      console.log("new comment created");      
                    }
            });
            }  
    });
     
});
});

 };

module.exports = seedDB;