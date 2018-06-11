//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    mongoose = require('mongoose'),
    path = require('path'),
    cotasRouter = require('./routes/cotasRouter');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))


var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
  console.log("conectado nuvem ", mongoURL);
}
else{
  console.log("conectado local");
  mongoURL = 'mongodb://localhost:27017/comprecotas';
}



//mongoose conection


mongoose.connect(mongoURL);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'erros de conexão:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  
  res.render('index.html', { pageCountMessage : null});
 	
});

app.use('/cotas', cotasRouter);

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});



app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
