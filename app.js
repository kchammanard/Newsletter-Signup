const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
});
app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const email = req.body.email;
    const lastName = req.body.lastName;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/2fd9c980c1";

    const options = {
        method: "POST",
        auth: "kchammanard:5d14c82ac2526d86ed55424a746e91a6-us21"
    }

    const request = https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
    });


    request.write(jsonData);
    request.end();
});
app.post("/failure",function(req,res){
    res.redirect("/");
});
app.listen(3000, function(err){
    if (err) {
        console.log(err);
    }
    console.log("Server is runnning on port 3000")
});

//2fd9c980c1
//5d14c82ac2526d86ed55424a746e91a6-us21