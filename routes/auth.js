require("dotenv").config();
const router = require("express").Router();
const passport = require("passport");
const mongoose = require('mongoose');
const USER = require("../models/users")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;




const CLIENT_URL = "http://localhost:3000/";
const CLIENT_SUCCESS = "http://localhost:3000/profile";


// router.get("/",(req,res)=>{
//   res.send("Ok")
// })

// router.post("/okk",(req,res)=>{res.json("data posted");console.log("pagal")})


router.get("/login/success", (req, res) => {
    if (req.user) {
      res.status(200).json({
        success: true,
        message: "successfull",
        user: req.user,
        session: req.session // Use req.session instead of req.cookies
      });
    }
  });
  

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});


// const { google } = require('googleapis');

// router.get("/logout", (req, res, next) => {
//   if (!req.user) {
//     // If the user is not authenticated, redirect them to the client URL
//     return res.redirect(CLIENT_URL);
//   }

//   req.logout((err) => {
//     if (err) {
//       // Handle any errors that might occur during the logout process
//       return next(err);
//     }

//     // If the user is authenticated, get their access token and revoke it with Google's API
//     const accessToken = req.user.tokens.access_token;
//     const oauth2Client = new google.auth.OAuth2();
//     oauth2Client.revokeToken(accessToken, (err) => {
//       if (err) {
//         return next(err);
//       }

//       // Destroy the session
//       req.session.destroy((err) => {
//         if (err) {
//           return next(err);
//         }

//         // Redirect to the client URL
//         res.redirect(CLIENT_URL);
//       });
//     });
//   });
// });

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        // Handle any errors that might occur during the logout process
        return next(err);
      }
      req.session.destroy();
      res.redirect(CLIENT_URL);
    });
  });


  
  



router.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_SUCCESS,
    failureRedirect: "/login/failed",
  })
);




router.post("/signup",(req,res)=>{
  const {userName,email,password}=req.body;

  if(!userName || !email || !password)
  {
      return res.status(422).json({error:"Please add all the fields"})
  }

  USER.findOne({email:email}).then((savedUser)=>{
      if(savedUser)
      {
          return res.status(422).json({error:"User Already Exist with that email"})
      }

      bcrypt.hash(password,12).then((hashedPassword)=>{

          const user = new USER({
            userName,  
            email,
            password: hashedPassword,
            source:"Local",
            random1:"ok",
            totalProjects:"1000",
            totalEmployees:"5000",
            budgets:"20000",
            totalOrders:"65"
          })
      
          user.save()
          .then(user=>{res.json({message: "Registered Successfully"})})
          .catch(err=>{console.log(err)})

      })

      
  })

  

  
})


router.post("/signin",(req,res)=>{
  const {email,password,random1} = req.body;

  if(!email || !password)
  {
      return res.status(422).json({error:"Please add email and password"})
  }

  USER.findOne({email:email}).then((savedUser)=>{

      if(!savedUser)
      {
          return res.status(422).json({error:"Invalid Email"})
      }
      bcrypt.compare(password, savedUser.password)
      .then((match)=>{
          if(match)
          {
              //return res.status(200).json({message:"Signed In Successfully"})
                  const token = jwt.sign({_id:savedUser.id},JWT_SECRET);
                  const { _id, userName, email, source, random1,totalProjects,totalEmployees,budgets,totalOrders } = savedUser;
                  
                  res.json({ token, user: { _id, userName, email, source, random1,totalProjects,totalEmployees,budgets,totalOrders } })
                  console.log({ token, user: { _id, userName, email, random1 ,totalProjects,totalEmployees,budgets,totalOrders } })
                  
              
          }
          else
          {
              res.status(422).json({error:"Invalid Password"})
          }
      })
      .catch(err=>console.log(err))
  })
})




module.exports = router;