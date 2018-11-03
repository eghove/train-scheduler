//INITIALIZE FIREBASE
//===========================================================================
var config = {
    apiKey: "AIzaSyD_wnOy1sSiYD_V1b4DYhZlu29jgUGMxR4",
    authDomain: "hove-train-scheduler.firebaseapp.com",
    databaseURL: "https://hove-train-scheduler.firebaseio.com",
    projectId: "hove-train-scheduler",
    storageBucket: "hove-train-scheduler.appspot.com",
    messagingSenderId: "645791438385"
  };

  firebase.initializeApp(config);

//VARIABLES
//===========================================================================
//variable to reference the firebase database
var dataRef=firebase.database();

//default values for info pulled from Add Train form
let trainName = '';
let trainDestination='';
let frequency=0;
let firstTrain='';
let timeUntilNextTrain=0;
let nextTrainTime=0;


//FUNCTIONS
//===========================================================================
//function that pushes the new data into firebase
function dataPush (trainName, trainDestination, firstTrain, frequency) {
    dataRef.ref().push({
        name: trainName,
        destination: trainDestination,
        firstDeparture: firstTrain,
        freq: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
}

//function that calculates times
function calcTimes(departureTime, frequency) {
    //set up the military format
    let format = "HH:mm";
    //get the time right now, format it in military time
    let timeRightNow = moment().format();
    let timeRightNow2 = moment(timeRightNow, format);
    //let convertedTimeRightNow=timeRightNow2.format(format);
    //console.log(convertedTimeRightNow);

    //assign frequency parameter to freq2
    let freq2 = frequency;
    
    //making sure the information for firstDeparture is in the right format
    departureTime2 = moment(departureTime, format);
    

    //figure out how many minutes have elapsed between timeRightNow2 and departureTime
    let minutesElapsed = timeRightNow2.diff(departureTime2, "minutes");
    //console.log(minutesElapsed);

    //figure out how many trains have already passed
    let numberOfTrain = Math.floor(minutesElapsed / freq2);
    //console.log('This many trains have passed: ' + numberOfTrain);

    //multiply number of trains that have already passed by frequency
    let trainsByMinutes = numberOfTrain * freq2;
    //figure out the difference between the minutes have elapsed and how many full trains worth of minutes have gone by in the time
    timeUntilNextTrain = minutesElapsed - trainsByMinutes;
    if (timeUntilNextTrain > 0) 
    {
    //to make it countdown instead of counting up. still not working right
        timeUntilNextTrain = freq2 - timeUntilNextTrain; 
        //need to add time untilNextTrain to current time.
        nextTrainTime = moment(timeRightNow).add(timeUntilNextTrain, 'm');
        //format it back into military time
        nextTrainTime2 = nextTrainTime.format(format);
    }
    else
    {
        timeUntilNextTrain="Now";
        nextTrainTime2="Now";
    }
    //console.log('Minutes until next train: ' + timeUntilNextTrain);


   


    
};

//MAIN PROCESSES
//============================================================================

$(document).ready(function() {

//submit button listener
$( '#addTrain' ).on('click', function(event) {
    //prevent the submit button from refreshing the page
    event.preventDefault();
    //grab the entries from the form, assign them to variables
    trainName = $( '#trainName' ).val().trim();
    trainDestination = $( '#destination' ).val().trim();
    firstTrain = $( '#departure-time' ).val().trim();
    frequency = $( '#frequency' ).val().trim();
    //push the data from the form into the database
    dataPush(trainName, trainDestination, firstTrain, frequency);

});

//listens for changes in the database, renders the current shedule
dataRef.ref().on("child_added", function(childSnap) {
    var departureTime = childSnap.val().firstDeparture;
    var frequency = childSnap.val().freq;
    calcTimes(departureTime, frequency);


    //creates the table rows pulling in firebase data
    var tableRow =$("<tr>");
    //displays for each item in the table
    var trainNameDisplay = $("<td>" + childSnap.val().name + "</td>" );
    var destinationDisplay =$("<td>" + childSnap.val().destination + "</td>" );
    var frequencyDisplay = $("<td>" + childSnap.val().freq + "</td>" );
    var nextArrivalDisplay = $("<td>" + nextTrainTime2 + "</td>" ); //dummy value
    var minutesAwayDisplay = $("<td>" +  timeUntilNextTrain + "</td>" ); //dummy value
    //append all the displays above to the tableRow
    tableRow.append(trainNameDisplay).append(destinationDisplay).append(frequencyDisplay).append(nextArrivalDisplay).append(minutesAwayDisplay);
    //append modified tableRow to the DOM
    $( '#train-display' ).append(tableRow);
});


}) //end of ready function