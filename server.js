var express = require('express');
var app = express();
var mongodb = require('mongodb');
let mongoDBClient = mongodb.MongoClient;
var express = require('express');
var bodyParser = require('body-parser');




let viewsPath = __dirname + "/views/";
let db = null; //database
let col = null; //collection (i.e. table)
let url = "mongodb://localhost:27017";


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('images'));
app.use(express.static('css'));
app.use(bodyParser.urlencoded({
    extended: false
}));

mongoDBClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, client) {
    db = client.db('w6lab');
    col = db.collection('toDoList');
});

app.get('/', function (req, res) {
    let randomId = Math.round(Math.random() * 100);
    res.render('index.html', {
        username: "Admin",
        id: randomId
    });
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/addTask.html', function (req, res) {
    console.log("addTask");
    res.sendFile(viewsPath + 'addTask.html');
});

app.post('/addThisTask', function (req, res) {
    let ranTaskId = Math.round(Math.random() * 100);

    let newTaskObj = {
        taskID: ranTaskId,
        taskName: req.body.taskName,
        taskDue: req.body.taskDue,
        assignTo: req.body.assignTo,
        taskDesc: req.body.taskDesc,
        taskStatus: req.body.taskStatus
    }
    col.insertOne(newTaskObj);

    res.render(viewsPath + 'listTask.html', {
        task: col,
        username: "Admin"
    });
});

app.get('/listTask.html', function (req, res) {
    let query = {};
    col.find(query).toArray(function (err, data) {
        res.send(data);
    });
    // console.log("listTask");
    // res.render('listTask.html', {
    //     task: col,
    //     username: "Admin"
    // });
});

app.get('/deleteCompleted.html', function (req, res) {
    res.sendFile(__dirname + '/views/listTask.html');
    let query = {
        taskStatus: {
            $eq: "complete"
        }
    };
    col.deleteMany(query, function (err, obj) {
        console.log(obj.result);
    });
});

app.get('/deleteTask.html', function (req, res) {
    res.sendFile(__dirname + '/views/deleteTask.html');
});
app.post('/deleteTask.html', function (req, res) {
    let taskID = parseInt(req.body);
    col.deleteOne({taskID: taskID}, function(err, obj){
        console.log(obj.result);
    });
    res.sendFile(__dirname + '/views/listTask.html');
});

app.listen(8080);