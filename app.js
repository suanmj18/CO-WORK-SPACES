var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose  = require("mongoose");
var passport    = require("passport");
var LocalStrategy = require("passport-local");  
var flash = require("connect-flash");
var Office   = require("./models/office");
var seedDB = require("./seeds");
var User = require("./models/user");
var Comment = require("./models/comment");

const PORT = process.env.PORT || 3000;

// mongoose.connect("mongodb://localhost/offices_database");
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser({urlencoded:true}));
app.use( express.static( "public"));
app.set ("view engine", "ejs");
app.use(flash()); 
// seedDB();     //seed the database


///PASSPORT CONFIGURATION

app.use(require("express-session")({
     secret:"Sparsh Kesari",
     resave: false,
     saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
});

// app.use(bodyParser({urlencoded:true}))
mongoose.connect("mongodb://localhost/offices_v9");



app.get("/" , function(req,res){
    res.render("landing");
});

// var offices = [
//     {name :"Office", image : "/images/Office.jpg"},
//    {name :"Hotdesk", image : "/images/Hotdesk.jpg"},
//     {name :"Amphitheatre", image : "/images/Amphi1.jpg"}
//     ];

    //index of all offices
app.get("/offices" , function(req,res){
//   console.log(req.user);
    Office.find({},function(err,allOffices){
        if(err){
            console.log(err);
        }
        else{
            res.render("offices/index",{offices:allOffices, currentUser : req.user});
       }
    });
    // res.render("offices",{offices:offices});
});

//create new office to database
app.post("/offices",isLoggedIn,function(req,res){
    var name = req.body.name;
    var image =req.body.image;
    var price = req.body.price;
    var address = req.body.address;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newOffice = {name:name, image:image ,price:price,address:address, description :desc, author:author };
      console.log(req.user);
   

    Office.create(newOffice,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/offices");
        }
    });
    // offices.push(newOffice);
    
});

//form to create new office
app.get("/offices/new",isLoggedIn,function(req,res){
res.render("offices/new");
});
 
// show route 

app.get("/offices/:id" ,function(req,res){
    Office.findById(req.params.id).populate("comments").exec(function(err, foundOffice){
            if(err){
                console.log(err);}
                else{
             console.log(foundOffice);           
    // res.send("this will be a page someday");
     res.render("offices/show",{office: foundOffice});
                
            }
    });
});



/////=======================================
// COMMENTS ROUTES
///================

app.get("/offices/:id/comments/new",isLoggedIn, function(req,res){
    Office.findById(req.params.id ,function(err,office){
        if(err){
            console.log(err);}
            else{
     res.render("comments/new",{office: office});
            }
   })
});

// app.get("/",function(req,res){
//     res.render("");
// });

// app.post("/offices/:id/comments",function(req,res){
//         //lookup office using ID
// Office.findById(req.params.id, function(err, office){
//     if(err){
//         console.log(err);
//         res.redirect("/offices");
//     }else{
//         console.log(req.body.comment);
//        Comment.create(req.body.comment, function(err,comment){
//         if (err){
//             console.log(err);
//         }
//         else{
//             office.comments.push(comment);
//             office.save();
//             res.redirect("/offices/" + office._id);
//         }
        


//        });
//     }
// });
// });

app.post("/offices/:id/comments", isLoggedIn, function(req, res){
    //lookup campground using ID
    Office.findById(req.params.id, function(err, office){
        if(err){
            console.log(err);
            res.redirect("/offices");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                req.flash("error","Something went wrong");
                console.log(err);
            } else {
                //add username and id to comment
                comment.author.id =  req.user._id;
                comment.author.username = req.user.username;
                // console.log("New comment by user " +req.user.username);
                comment.save();
                office.comments.push(comment);
                office.save();
                console.log(comment);
                req.flash("success","Comment added Successfuly")
                res.redirect('/offices/' + office._id);
            }
         });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
 });
 

//// submit route

app.get("/offices/:id/book/new",isLoggedIn, function(req,res){
    Office.findById(req.params.id ,function(err,office){
        if(err){
            console.log(err);}
            else{
     res.render("book/new",{office: office});
            }
   })
});



app.post("/offices/:id/book/new", isLoggedIn, function(req, res){
    //lookup campground using ID
    Office.findById(req.params.id, function(err, office){
        if(err){
            console.log(err);
            res.redirect("/offices");
        } else {
        //  Comment.create(req.body.comment, function(err, comment){
            if(err){
                req.flash("error","Something went wrong");
                console.log(err);
            } else {
                // //add username and id to comment
                // comment.author.id =  req.user._id;
                // comment.author.username = req.user.username;
                // // console.log("New comment by user " +req.user.username);
                // comment.save();
                // office.comments.push(comment);
                // office.save();
                // console.log(comment);
                // req.flash("success","Comment added Successfuly")
                res.redirect('/offices/' + office._id);
            }
         }});
        
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
 








 //Auth Routes


app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    var newUser = new User({username : req.body.username});
    User.register(newUser,req.body.password, function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
           req.flash("success", " Welcome to theOffice "+user.username);
            res.redirect("/offices");
        })
    });
});

//login from

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",
  {
      successRedirect : "/offices",
   failureRedirect : "/login"}
  ), function(res,req){

  });

//logout

app.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
        // req.flash("success","logged you out"); 
          return res.redirect('/offices');
        }
      });
    }
  });


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login to do that!!");
    res.redirect("/login");
    
}


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log("The YelpCamp Server Has Started!");
  });   