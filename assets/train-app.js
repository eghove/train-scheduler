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


//FUNCTIONS
//===========================================================================


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
});





}) //end of ready function