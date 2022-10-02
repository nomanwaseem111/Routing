import express from 'express'
import cors from 'cors'
import {stringToHash,varifyHash} from "bcrypt-inzi"
import mongoose from 'mongoose'
const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 3001

const userSchema = new mongoose.Schema({
    firstName: {type : String, required:true},
    lastName: {type : String, required:true},
    email: {type : String, required:true},
    password: {type : String, required:true},
    createdOn: {type : Date, default:Date.now()}
});


  const userModel = mongoose.model('User', userSchema);



app.post('/signup', (req, res) => {


    let body = req.body

    if(!body.firstName ||!body.lastName ||!body.email ||!body.password){
        res.status(400).send(`Please Fill all Required Fields`)
        return
    }


    userModel.findOne({email:body.email} , (err,data) => {

        if(!err){
  
            console.log("data" , data);

            if(data){ //User already Exist
               console.log("User is Already Exits", data);
               res.status(400).send({message : "User is Already Exist"})
               return;
                 
            }else{

                stringToHash(body.password).then(hashString => {

                      let newUser = new userModel ({

                        firstName : body.firstName,
                        firstName : body.lastName,
                        email: body.email.toLowerCase(),
                        password : hashString
                     })
                     newUser.save((err,result) => {
                     
                        if(!err){

                            console.log("Data Saved", result);
                            res.status(201).send({message : "User is Signup"})

                        }else{
                           console.log("db error", err);
                           res.status(500).send({message : "db error in saving data"})
                           return
                        }
                         
                   })


                    })
         }
             
        }else{
            console.log("db error" ,err );
            res.status(500).send({message : "Internal Server Error"})
            return
        }

    })


  
})


app.post('/login', (req, res) => {


    let body = req.body

    if(!body.email ||!body.password){
        res.status(400).send(`Please Fill all Required Fields`)
        return
    }


      userModel.findOne({email:body.email}, (err,data) => {


       if(!err){

          console.log("data", data);
         
            if(data){ //user found
   
                varifyHash(body.email,data.email).then(isMatched => {
                   
                    if(isMatched){
                        console.log("Login Successful");
                        res.status(201).send({message : "Login Successful"})
                        return;
                    }else{
                        console.log("Login Fail");
                        res.status(401).send({message: "Incorrect email and password"})
                    }

                })
                 
            }else{ // user not found
                console.log("User not Found");
                res.status(401).send({message: "Incorrect email and password"})
            }
         
       }else{
        console.log("db error", err);
        res.status(500).send({message: "Internal server error"})
        return;

       }


      })

  
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


let dbURI = "mongodb+srv://abc:abc@cluster0.svkl5lr.mongodb.net/newDataBase?retryWrites=true&w=majority";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////