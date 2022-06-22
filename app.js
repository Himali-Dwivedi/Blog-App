//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { sendfile } = require("express/lib/response");
const { request } = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Welcome to our home page! Seems like no blog has been posted  till now. Please sign up to our newsletter to receive the latest updates on our website.";
const aboutContent =
  "If you are Computer Science geek and love to explore the latest trends in the tech world, you crash landed to the perfect website.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//connecting to local mongoose DB
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//creating schema
const post_schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});

//creating model
const Post = mongoose.model("Post", post_schema);

app.get("/", function (request, response) {

  Post.find({}, function(error, found_result){
    if(error){
      console.log(error);
    }else{
      response.render("home",{
        home_content : homeStartingContent,
        blog_list : found_result
      });
    }
  });
});

app.get("/contact", function (request, response) {
  response.render("contact", {
    contact_content: contactContent,
  });
});

app.get("/about", function (request, response) {
  response.render("about", { about_content: aboutContent });
});

app.get("/compose", function (request, response) {
  response.render("compose");
});

app.get("/blogs/:blogId/", function (request, response) {
  let is_match_found = false;
  var published_blogs_title;
  var published_blogs_content;
  var request_params_id = request.params.blogId;

  Post.findOne({_id: request_params_id}, function(error, found_result){
    if(!error){
      response.render("post", {
        post_title: found_result.title,
        post_content: found_result.content
      })
    }
  })

});

app.post("/compose", function (request, response) {

  const newPost = new Post({
    title: request.body.title,
    content: request.body.blog,
  });

  newPost.save(function(error){
    if(!error){
      response.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
