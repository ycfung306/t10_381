// http://101.78.220.133:8099/?lat=22.316109&lon=114.180459&zoom=18

var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongourl = 'mongodb://localhost:27017/test';

app.set('view engine', 'ejs');

app.use(express.static(__dirname +  '/public'));

app.get("/", function(req,res) {
	var lat  = req.query.lat;
	var lon  = req.query.lon;
	var zoom = req.query.zoom;

	res.render("gmap.ejs",{lat:lat,lon:lon,zoom:zoom});
	res.end();
});

//Task 3
app.get("/list", function(req, res){

  MongoClient.connect(mongourl,function(err,db){
    console.log('Connected to db');
    assert.equal(null,err);
    var cafes = [];
    cursor = db.collection('cafes').find({}, {"name" : 1, "id" : 1});
    cursor.each(function(err, doc) {
      assert.equal(err, null); 
      if (doc != null) {
        cafes.push(doc);
      } else {
        res.render("cafelist.ejs", {"cafes" : cafes});
        res.end();
        db.close();
      }  
    });
  });
});

//Task 2
app.get("/showdetails", task2);
app.get("/showonmap", task2);

function task2(req, res){
  MongoClient.connect(mongourl,function(err,db){
    console.log('Connected to db');
    assert.equal(null,err);
    db.collection('cafes').findOne({"id" : req.query.id}, function(err, doc){
      assert.equal(err, null); 
      if (doc != null) {
        res.render("cafedetail.ejs", doc);
        //res.render("gmap.ejs",{lat:doc.coord[0],lon:doc.coord[1],zoom:18});
        res.end();
      }
      db.close();
    });
  });
}
app.listen(process.env.PORT || 8099);
