const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const port = process.env.PORT || 3000;
const { log } = require("console");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.render("index");
});      

app.get("/image_page", function(req, res){
    res.render("image_page");
});

app.post("/image_page", function(req, res){
    const keyword = req.body.keyword;
    var link;
    const query = keyword;
    const url = "https://api.unsplash.com/photos/random/?client_id=ko3or52XF4no9V8DmYQmPFG7jAM_gkxcayGkN4S-lGU&query=" + query;
    https.get(url, (result) => {
        var data = "";
        result.on("data", function(chunk) {
            data += chunk;
        });
        result.on("end", () => {
            try {
                const api_data = JSON.parse(data);
                link = api_data.urls.raw;
                res.render("image_page", {img_src: link});
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.status(500).send("Internal Server Error");
            }
        });
    }).on("error", (error) => {
        console.error("Error making HTTP request:", error);
        res.status(500).send("Internal Server Error");
    });
})

app.listen(port, function(){
    console.log("server started on port "+port);
});