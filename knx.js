const knx = require('knx')

var connection = new knx.Connection(
    {
    // ip address and port of the KNX router or interface
    ipAddr: '192.168.1.10', ipPort: 3671, minimumDelay: 10,
    // in case you need to specify the multicast interface (say if you have more than one)
    // define your event handlers here:
    handlers: {
      // wait for connection establishment before sending anything!
      connected: function() {
        console.log('Hurray, I can talk KNX!');
        connection.write("0/1/1", 0);
        connection.write("0/1/2", 0);
        connection.write("0/1/3", 0);
        connection.write("0/1/4", 0);
        },
        // get notified for all KNX events:
        event: function(evt, src, dest, value) { console.log(
            "event: %s, src: %j, dest: %j, value: %j",
            evt, src, dest, value
          );
          var data = value
          var jsonstr = JSON.stringify(data)
          var json = JSON.parse(jsonstr)
          var state = json.data[0]
          //var state = (JSON.parse(JSON.stringify(value)).data[0]
          chenillardControl(connection,dest,state)
          if (WSconnection.connected) {
            var json = {dest : dest, state : state}
           WSconnection.sendUTF(JSON.stringify(json));
         }
        },
        // get notified on connection errors
        error: function(connstatus) {
          console.log("**** ERROR: %j", connstatus);
        }
  //...
        }
  
});


process.on('SIGINT',function(){
  clearInterval(chen)
  connection.Disconnect()
  console.log('Disconnected')
  process.exit();
})

var connected = false
var nb = 0
var chen;
var on = false
var temps = 1000
var sens = true
var ordre = false
var array
var WSconnection;

function chennillard(connection,sens,ordre){
  if(ordre){
  chenordre(connection,array)
  }
  else {
    if(sens){
      console.log("chennillard")
      switch (nb) {
        case 1:
          connection.write("0/1/1", 1);
          connection.write("0/1/4", 0);
            break;
        case 2:
          connection.write("0/1/1", 0);
          connection.write("0/1/2", 1);
          break;
        case 3:
          connection.write("0/1/2", 0);
          connection.write("0/1/3", 1);
          break;
        case 4:
          connection.write("0/1/3", 0);
          connection.write("0/1/4", 1);
          nb = 0
          break;
    
      }
      nb+=1
    }
    else {
      console.log("chennillard inv ")
      console.log(nb)
      switch (nb) {
        case 1:
          connection.write("0/1/1", 0);
          connection.write("0/1/4", 1);
            break;
        case 2:
          connection.write("0/1/3", 1);
          connection.write("0/1/4", 0);
          break;
        case 3:
          connection.write("0/1/2", 1);
          connection.write("0/1/3", 0);
          break;
        case 4:
          connection.write("0/1/1", 1);
          connection.write("0/1/2", 0);
          nb = 0;
          break;
    
      }
      nb+=1
    }
  }
}
function chenordre(connection,array){
  console.log("chenorde")
  switch (nb) {
    case 1:
    var current = "0/1/" + array[1]
    var previous = "0/1/" + array[0]
    connection.write(current, 1);
    connection.write(previous, 0);
        break;
    case 2:
    var current = "0/1/" + array[2]
    var previous = "0/1/" + array[1]
    connection.write(current, 1);
    connection.write(previous, 0);
      break;
    case 3:
    var current = "0/1/" + array[3]
    var previous = "0/1/" + array[2]
    connection.write(current, 1);
    connection.write(previous, 0);
      break;
    case 4:
    var current = "0/1/" + array[0]
    var previous = "0/1/" + array[3]
    connection.write(current, 1);
    connection.write(previous, 0);
    nb = 0
    break;
  }
  nb+=1
}
function chenillardControl(connection,dest,state){
  switch (dest){
    case "0/3/1":
    // start/stop chennillard
    if(on){
    clearInterval(chen)
    on = false
    }
    else {
        clearInterval(chen)
        on = true
        sens = true
        chen = setInterval(
          function() {
            chennillard(connection,true,ordre)
          }, temps);
    }
      break;

    case "0/3/2":
    // inverse sens
    if(on){
      clearInterval(chen)
      sens = !sens
      chen = setInterval(
        function() {
          chennillard(connection,sens,ordre)
        }, temps);
    }
      break;

    case "0/3/3":
    // + vite
    if(on){
      clearInterval(chen)
      if(temps>500){
        temps= temps - 100
        chen = setInterval(
          function() {
            chennillard(connection,sens,ordre)
          }, temps);
      }
    }
    break;

    case "0/3/4":
    // - vite
      if(on){
      clearInterval(chen)
      temps = temps + 100
      chen = setInterval(
        function() {
          chennillard(connection,sens,ordre)
        }, temps);
      }
      break
  }

}
function runserver(){
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.get('/', function(req, res) {
  res.send('bienvenue sur knx-master server');
});

app.get('/login', function(req, res) {
  if(connected){
    clearInterval(chen)
    connection.Disconnect()
    connected = false
    console.log('disconnected')
  }
  res.send('connected');
  connected = true
  connection = new knx.Connection(
    {
    // ip address and port of the KNX router or interface
    ipAddr: '192.168.0.5', ipPort: 3671, minimumDelay: 10,
    // in case you need to specify the multicast interface (say if you have more than one)
    // define your event handlers here:
    handlers: {
      // wait for connection establishment before sending anything!
      connected: function() {
        console.log('Hurray, I can talk KNX!');
        connection.write("0/1/1", 0);
        connection.write("0/1/2", 0);
        connection.write("0/1/3", 0);
        connection.write("0/1/4", 0);
        },
        // get notified for all KNX events:
        event: function(evt, src, dest, value) { console.log(
            "event: %s, src: %j, dest: %j, value: %j",
            evt, src, dest, value
          );
          var data = value
          var jsonstr = JSON.stringify(data)
          var json = JSON.parse(jsonstr)
          var state = json.data[0]
          //var state = (JSON.parse(JSON.stringify(value)).data[0]
          chenillardControl(connection,dest,state)
          if (WSconnection.connected) {
            var json = {dest : dest, state : state}
           WSconnection.sendUTF(JSON.stringify(json));
         }
        },
        // get notified on connection errors
        error: function(connstatus) {
          console.log("**** ERROR: %j", connstatus);
        }
  //...
        }
  
    });

  console.log('connected')
});

app.post('/login', function(req, res) {
  if(connected){
    clearInterval(chen)
    connection.Disconnect()
    connected = false
    console.log('disconnected')
  }
  var keys = Object.keys(req.body);
  let number = parseInt(keys[ 0 ].toString())
  console.log(number)
switch (number) {
    case 5:
      connection = new knx.Connection(
        {
        // ip address and port of the KNX router or interface
        ipAddr: '192.168.1.5', ipPort: 3671, minimumDelay: 10,
        // in case you need to specify the multicast interface (say if you have more than one)
        // define your event handlers here:
        handlers: {
          // wait for connection establishment before sending anything!
          connected: function() {
            console.log('Hurray, I can talk KNX!');
            connection.write("0/1/1", 0);
            connection.write("0/1/2", 0);
            connection.write("0/1/3", 0);
            connection.write("0/1/4", 0);
            },
            // get notified for all KNX events:
            event: function(evt, src, dest, value) { console.log(
                "event: %s, src: %j, dest: %j, value: %j",
                evt, src, dest, value
              );
              var data = value
              var jsonstr = JSON.stringify(data)
              var json = JSON.parse(jsonstr)
              var state = json.data[0]
              //var state = (JSON.parse(JSON.stringify(value)).data[0]
              chenillardControl(connection,dest,state)
              if (WSconnection.connected) {
                var json = {dest : dest, state : state}
               WSconnection.sendUTF(JSON.stringify(json));
             }
            },
            // get notified on connection errors
            error: function(connstatus) {
              console.log("**** ERROR: %j", connstatus);
            }
      //...
            }
      
      });
      connected = true
      res.send('connected');
      console.log('connected')
        break;
    case 6:
      connection = new knx.Connection(
        {
        // ip address and port of the KNX router or interface
        ipAddr: '192.168.0.6', ipPort: 3671, minimumDelay: 10,
        // in case you need to specify the multicast interface (say if you have more than one)
        // define your event handlers here:
        handlers: {
          // wait for connection establishment before sending anything!
          connected: function() {
            console.log('Hurray, I can talk KNX!');
            connection.write("0/1/1", 0);
            connection.write("0/1/2", 0);
            connection.write("0/1/3", 0);
            connection.write("0/1/4", 0);
            },
            // get notified for all KNX events:
            event: function(evt, src, dest, value) { console.log(
                "event: %s, src: %j, dest: %j, value: %j",
                evt, src, dest, value
              );
              var data = value
              var jsonstr = JSON.stringify(data)
              var json = JSON.parse(jsonstr)
              var state = json.data[0]
              //var state = (JSON.parse(JSON.stringify(value)).data[0]
              chenillardControl(connection,dest,state)
              if (WSconnection.connected) {
                var json = {dest : dest, state : state}
               WSconnection.sendUTF(JSON.stringify(json));
             }
            },
            // get notified on connection errors
            error: function(connstatus) {
              console.log("**** ERROR: %j", connstatus);
            }
      //...
            }
      
      });
      connected = true
      res.send('connected');
      console.log('connected')
      break;
    case 10:
      connection = new knx.Connection(
        {
        // ip address and port of the KNX router or interface
        ipAddr: '192.168.1.10', ipPort: 3671, minimumDelay: 10,
        // in case you need to specify the multicast interface (say if you have more than one)
        // define your event handlers here:
        handlers: {
          // wait for connection establishment before sending anything!
          connected: function() {
            console.log('Hurray, I can talk KNX!');
            connection.write("0/1/1", 0);
            connection.write("0/1/2", 0);
            connection.write("0/1/3", 0);
            connection.write("0/1/4", 0);
            },
            // get notified for all KNX events:
            event: function(evt, src, dest, value) { console.log(
                "event: %s, src: %j, dest: %j, value: %j",
                evt, src, dest, value
              );
              var data = value
              var jsonstr = JSON.stringify(data)
              var json = JSON.parse(jsonstr)
              var state = json.data[0]
              //var state = (JSON.parse(JSON.stringify(value)).data[0]
              chenillardControl(connection,dest,state)
              if (WSconnection.connected) {
                var json = {dest : dest, state : state}
               WSconnection.sendUTF(JSON.stringify(json));
             }
            },
            // get notified on connection errors
            error: function(connstatus) {
              console.log("**** ERROR: %j", connstatus);
            }
      //...
            }
      
      });
      connected = true
      res.send('connected');
      console.log('connected')
      break;
  }
});

app.get('/logout', function(req, res) {
  if(connected){
    clearInterval(chen)
    connection.Disconnect()
    res.send('disconnected');
    connected = false
    console.log('disconnected')
  }else {
    res.send('already disconnected');
    console.log('already disconnected')
  }
});

app.post('/stop', function(req, res) {
if(connected){
  res.send('chennilard stoped')
  clearInterval(chen)
  on = false
}else {
    res.send('not connected');
}
});

app.post('/start', function(req, res) {
    if(connected){
        res.send('chennilard started')
        clearInterval(chen)
        on = true
        sens = true
        ordre = false
        chen = setInterval(
          function() {
            chennillard(connection,true,false)
          }, temps);
      }else {
          res.send('not connected');
      }

});

app.post('/inv', function(req, res) {
    if(connected){
      connection.write("0/1/1", 0);
      connection.write("0/1/2", 0);
      connection.write("0/1/3", 0);
      connection.write("0/1/4", 0);
        res.send('chennilard invert')
        clearInterval(chen)
        sens = !sens
        ordre = false
        chen = setInterval(
          function() {
            chennillard(connection,sens,false)
          }, temps);
      }else {
          res.send('not connected');
      }
});

app.post('/time', function(req, res) {
    if(connected){
        res.send('time changed')
        console.log(req.body)
        //verifier le format
        var jsonObject = {}.constructor;
        //Verify if the data is a JSON object
        //var json = JSON.parse(res.body)
        var keys = Object.keys(req.body);
        json = JSON.parse(keys[ 0 ].toString())
        console.log(json.time)
          var t = parseInt(json.time)
          if(on){
            clearInterval(chen)
            if(t>=500){
              console.log('time : '+t)
              temps = t
              chen = setInterval(
                function() {
                  chennillard(connection,sens,ordre)
                }, t);
            }
          }
      }else {
        res.send('not connected');
      }
});

app.post('/ordre', function(req, res) {
  if(connected){
    connection.write("0/1/1", 0);
    connection.write("0/1/2", 0);
    connection.write("0/1/3", 0);
    connection.write("0/1/4", 0);
    var keys = Object.keys(req.body);
        string = keys[ 0 ].toString()
        console.log(string)
        //array = json.ordre
        array = string.split(",").map(Number);
      res.send('chen ordre')
      ordre = true
      clearInterval(chen)
      chen = setInterval(
        function() {
          chennillard(connection,sens,true)
        }, temps);
      
    }else {
      res.send('not connected');
    }
});

//start our web server and server listening
server.listen(1234, function(){
  console.log('listening on *:1234');
});

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
  httpServer: server
});
// WebSocket server
wsServer.on('request', function(request) {
  WSconnection = request.accept(null, request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  WSconnection.on('message', function(message) {
    if (message.type === 'utf8') {
      // process WebSocket message
      console.log("message : "+ message)
     /* WSconnection.send("message reçu");
      var json = JSON.parse(message.utf8Data)
      console.log("dest : "+ json.dest)
      console.log("state : "+ json.state)*/
    }
  });

  WSconnection.on('close', function(connection) {
    // close user connection
  });
});

}

runserver()