var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

mongoose.connect('mongodb://localhost/bears')


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

app.use('/api', router);
router.use(function(re, res, next) {
    console.log('Something is happening');
    next();
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/bears')
    .post(function(req, res) {
        var bear = new Bear();
        bear.name = req.body.name;

        bear.save(function(err) {
            if(err) res.send(err);
            res.json({message: 'Bear created!'});
        })
    })
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if(err) res.send(err);
            res.json(bears);
        })
    });

router.route('/bears/:id')
    .get(function(req, res) {
        Bear.findById(req.params.id, function(err, bear) {
            if(err) res.send(err);

            res.json(bear);
        })
    })
    .put(function(req, res) {
        Bear.findById(req.params.id, function(err, bear){
            if(err) res.send(err);

            bear.name = req.body.name;

            bear.save(function(err) {
                if(err) res.send(err);

                res.json({ message: 'Bear updated' });
            })
        })
    })
    .delete(function(req,res) {
        Bear.remove({ _id: req.params.id }, function(err, bear) {
            if(err) res.send(err);
            res.json({ message: 'Skrillex is kill'})
        })
    })

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);