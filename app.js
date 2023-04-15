//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));







app.get("/", function (req, res) {

    res.render("home");
});


app.get("/about", function (req, res) {

    res.render("about");
});


app.get("/signup", function (req, res) {

    res.render("signup");
});


//POST request
app.post("/signup", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const password = req.body.password;


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
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/d639c8ffc9";

    const options = {
        method: "POST",
        auth: "Dibash:1f250862ab92e762e368e6f8cc28f0c1-us21"
    }

    const request = https.request(url, options, function (response) {


        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/index.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })


    })

    request.write(jsonData);
    request.end();
});


app.get("/membership", function (req, res) {

    res.render("membership");
});


app.get("/equipment", function (req, res) {

    res.render("equipment");
});



app.get("/facilities", function (req, res) {

    res.render("facilities");
});


app.get("/services", function (req, res) {

    res.render("services");
});

app.get("/payment", function (req, res) {

    res.render("payment");
});

//POST request
app.post("/payment", function (req, res) {
    const cardName = req.body.fName;
    const cardno = req.body.lName;
    const email = req.body.email;
    const password = req.body.password;


    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {



                }



            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/d639c8ffc9";

    const options = {
        method: "POST",
        auth: "Dibash:1f250862ab92e762e368e6f8cc28f0c1-us21"
    }

    const request = https.request(url, options, function (response) {


        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })


    })

    request.write(jsonData);
    request.end();
});


app.get("/add", function (req, res) {

    res.render("add");
});



mongoose.connect("mongodb+srv://DibashDey:Dibash@dibash.ca3qfqn.mongodb.net/todolistDB", { useNewUrlParser: true });



const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
    name: "Welcome to your todolist!"
});



const defaultItems = [item1];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/list", function (req, res) {

    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully savevd default items to DB.");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }
    });

});







app.post("/list", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});
















//use express app to listen on 3000 and log when it's working
app.listen(3000, function () {
    console.log("Server is running on port 3000.")
});


// API key
// 1f250862ab92e762e368e6f8cc28f0c1-us21

// List Id
// d639c8ffc9


// API key
// b835ed20c5c47603fbad84d92e74898e-us21

// List Id
// a0e753aeb5
