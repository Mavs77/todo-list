
const express = require('express'); 
//creates an instance of an express applicatoin. will be used to set up middleware, define routes, and handle HTTP requests. 
const app = express();
//imports the MongoClient object from the MongoDB driver. MongoClient provides a way to connect to and interact with a MongoDB database 
const MongoClient = require('mongodb').MongoClient; 
const PORT = 2929;
//loads environment variables from a '.env' file into 'process.env'
require('dotenv').config();  

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//this line initiates a connection to a MongoDB database. 'MongoClinet.connect()' calls the connect method of the MongoClient object to connect to a MongoDB database
MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
//this code sets up some important middleware and configurations for an express.js applicatoin
app.set('view engine', 'ejs'); 
app.use(express.static('public')); 
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 

app.get('/', (req, res)=>{
    db.collection('ClusterTODO').find().toArray()
    .then(data => {
        db.collection('ClusterTODO').countDocuments({completed: false})
        .then(itemsLeft => {
            res.render('index.ejs', {items: data, left: itemsLeft})
        })
    })
    .catch(error => console.error(error)); 
})


app.post('/addTodo', (req, res) => {
    db.collection('ClusterTODO').insertOne({thing: req.body.todoItem, completed: false})
    .then(result => {
        console.group('Todo Added'); 
        res.redirect('/'); 
    })
    .catch(error => console.error(error)); 
})

app.put('/markComplete', (req, res) => {
    db.collection('ClusterTODO').updateOne({thing: req.body.itemFromJS}, {$set: {
        completed: true
    }})
    .then(result => {
        console.log('Marked Complete'); 
        res.json('Marked Complete'); 
    })
    .catch(error => console.error(error)); 
})

app.put('/markUnComplete', (req, res) => {
    db.collection('ClusterTODO').updateOne({thing: req.body.itemFromJS}, {$set: {
        completed: false
    }})
    .then(result => {
        console.log('Marked Complete'); 
        res.json('Marked Complete'); 
    })
    .catch(error => console.error(error)); 
})

app.delete('/deleteItem', (req, res) => {
    db.collection('ClusterTODO').deleteOne({thing: req.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted'); 
        res.json('Todo Deleted'); 
    })
    .catch(error => console.error(error)); 
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`); 
})