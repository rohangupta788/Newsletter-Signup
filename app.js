const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const https = require('https');


const app = express();

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.email;

  const data ={
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: fname,
          LNAME: lname
        }
      }
    ]
  };
  const jsondata= JSON.stringify(data);
  const url= "https://us1.api.mailchimp.com/3.0/lists/{listId}";
  const options ={
    method:"POST",
    auth: "rohan:{apiKey}"
  }

  const request= https.request(url,options,function(response){

   if(response.statusCode===200){
     res.sendFile(__dirname+"/success.html")
   }
   else{
     res.sendFile(__dirname+"/failure.html")
   }

    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })
request.write(jsondata);
request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000 ,function(){
  console.log("server is running.");
});
