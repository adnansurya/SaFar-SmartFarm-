const functions = require('firebase-functions');
const express = require('express');

// Initialize the default app
var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://safarm2m.firebaseio.com",
  databaseAuthVariableOverride: null

});
const db = admin.database();

const app = express();



app.use(express.static(__dirname + 'public'));


app.get('/update/:hum/:temp/:hi/:moist', function (req, res){
    let humidity, temperature, heat_index, soil_moisture, waktu;
    humidity = req.params.hum;
    temperature = req.params.temp;
    heat_index = req.params.hi;
    soil_moisture = req.params.moist;
  
    var currentDate = new Date();
  
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var hour = currentDate.getHours(); // GMT +0
    var minute = currentDate.getMinutes();
    var second = currentDate.getSeconds();
  
    var dateString = date + "-" +(month + 1) + "-" + year + " " + (hour+8) + ":" + minute +  ":" + second;
  
    waktu =  dateString;
  
  
    db.ref('monitor/').set({
  
      humidity: humidity,
      heat_index: heat_index,
      temperature : temperature,
      soil_moisture : soil_moisture 
      // waktu : waktu
    });

    

    // res.send("Humidity : " + humidity + " | Heat Index : " + heat_index + 
    // " | Temperature :" + temperature + " | Soil Moisture : " + soil_moisture);
    res.send(waktu);
});

exports.apps = functions.https.onRequest(app);

let newData;
let original;
exports.addTime = functions.database.ref('/monitor')
    .onWrite((change, context) => {
      // Grab the current value of what was written to the Realtime Database.
      original = change.after.val();
      newData = JSON.stringify(original);
      console.log("NEW : " + newData);

      var currentDate = new Date();
  
      var date = currentDate.getDate();
      var month = currentDate.getMonth(); //Be careful! January is 0 not 1
      var year = currentDate.getFullYear();
      var hour = currentDate.getHours(); // GMT +0
      var minute = currentDate.getMinutes();
      var second = currentDate.getSeconds();
    
      var dateString = date + "-" +(month + 1) + "-" + year + " " + (hour+8) + ":" + minute +  ":" + second;
    
      waktu =  dateString;
      console.log(waktu);

      return db.ref('/log/' + waktu).set(original)    
      // .then(function() {
      //   return db.ref('monitor').once('value');
      
      // }).then(function(snapshot){
        
      //   let data = snapshot.val();
      //   console.log(data);
      //  // return db.ref('/monitor/waktu').set(waktu);
      // });
});