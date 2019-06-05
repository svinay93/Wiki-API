const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const ejs= require("ejs");
const app =express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/WikiDB",{useNewUrlParser:true});
const articleSchema = {
  title:String,
  content:String
};
const Article = mongoose.model("article",articleSchema);

app.route("/articles")
.get(function(req,res){
  Article.find({},function(err,result){
    if(err){
      console.log(err);
    }
    else{
    res.send(result);
    }
  });
})
.post(function(req,res){
  const title = req.body.title;
  const content = req.body.content;
  const article = new Article({
    title:title,
    content:content
  });
  article.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("Successfully Inserted");
    }
  });
})
.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(err){
      console.log(err);
    }
    else{
      res.send("Successfully Deleted");
    }
  });
});
app.route("/articles/:Article")
  .get(function(req,res){
    const articleName=req.params.Article;
    Article.findOne({title:articleName},function(err,result){
      if(result){
        res.send(result);
      }
      else{
        res.send("No articles matching the title was found");
      }
    });
  })
  .put(function(req,res){
    Article.update(
      {title:req.params.Article},
      {title:req.body.title,content:req.body.content},
      {overwrite:true},
      function(err){
        if(!err){
          res.send("Successfully Updated Article");
        }
      }
    );
  })
  .patch(function(req,res){
    Article.update(
      {title:req.params.Article},
      {$set:req.body},
      function(err){
        if(!err){
          res.send("Successfully Updated Article");
        }
      }
    );
  })
  .delete(function(req,res){
    Article.deleteOne({title:req.params.Article},function(err){
      if(!err){
        res.send("Successfully Deleted");
      }
      else{
        res.send(err);
      }
    });
  });
app.listen(3000,function(){
  console.log("Listening on port 3000");
});
