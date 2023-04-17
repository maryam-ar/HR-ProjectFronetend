const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    
  },
  source:{
    type: String
  },
  random1:{
    type:String
  },
  totalProjects:{
    type:String
  },
  totalEmployees:{
    type:String
  },
  budgets:{
    type:String
  },
  totalOrders:{
    type:String
  }
  // data:{
  //   fullname:{
  //     type:String
  //   },
  //   role:{
  //     typr:String
  //     }
  //     }
  
 
});

module.exports = mongoose.model("User", UserSchema);
