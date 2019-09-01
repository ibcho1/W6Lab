var express = require('express');
var app = express();
var bodyParser = require('body-parser');

let viewsPath = __dirname + "/views/";
let db = [];

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('images'));
app.use(express.static('css'));


app.get('/', function (req, res) {
    let randomId = Math.round(Math.random() * 100);
    res.render('index.html', {
        username: "admin",
        id: randomId
    });
});

app.use(bodyParser.urlencoded({extended:false}));

app.get('/addTask.html', function (req, res) {
    console.log("addTask");
    res.sendFile(viewsPath + 'addTask.html');
});

app.post('/addThisTask', function(req, res){
   console.log(req.body);
   db.push(req.body); 
   res.render(viewsPath + 'listTask.html', {
       task: db
    });
});

app.get('/listTask.html', function (req, res) {
    console.log("listTask");
    res.render('listTask.html', {
        task: db,
        username: "admin"
    });
});


app.listen(8080);