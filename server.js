require('dotenv').config()

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

const connectionString = process.env.connectStr


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quoteCollection = db.collection("quotes")
    //initialize ejs
    app.set('view engine', 'ejs');
    
    //use body parser
    app.use(express.urlencoded({extended:true}))
    //need to use external js folder to do put request and attach script to ejs file for main.js
    app.use(express.static("public"))
    //need this because we are using .json in main js for app.put req
    app.use(express.json())

    //read
    app.get("/", (req, res)=> {
        //cursor object contains all the quotes from the db
        quoteCollection.find().toArray()
            .then(result => {
                // console.log(result)
                //once promise is fullfill render ejs file, {quotes have to match the collection name} 
                res.render("index.ejs", {quotes: result})

            })
            .catch(err => {
                console.error(err)
            })

        // res.sendFile(__dirname + "/index.html")
    })

    //update
    app.post("/quotes", (req,res)=>{
        //add quotes
        quoteCollection.insertOne(req.body)
            .then(result => {
                // console.log(result)
                res.redirect("/")
            })
            .catch(err => {
                console.error(err)
            })
    })

    app.put("/quotes", (req, res)=> {
        // console.log(req.body)
        quoteCollection.findOneAndUpdate(
            {name: "Yoda"},
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            //options, upsert: true forces a new darth vader quote without yoda
            {
                upsert:true
            }
            )
            .then(result => {
                // console.log(result)
                // res.json("success")
                res.json("Success")
            })
            .catch(err =>{
                console.error(err)
            })
    })      

    // quotesCollection
    //     .deleteOne(query, options)
    //     .then(result => {
    //     /* ... */
    //     })
    //     .catch(error => console.error(error))
    app.delete("/quotes", (req, res)=>{
        quoteCollection.deleteOne(
            { name: req.body.name }
        )

        .then(result=> {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.json("It worked")
        })
        .catch(err =>{
            console.error(err)
        })
    })


    app.listen(process.env.PORT || 8000, () =>{
        console.log("listening on port 8000")
    }) 
  })
  .catch(error => console.error(error))

