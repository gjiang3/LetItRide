//GOOGLE MAP
var map;
var userCurrMarker;
var markers;
var pos;
var geocoder;
var directionsService;
var directionsDisplay;
var geocoder;
var trafficLayer;

//DRIVER and CUSTOMER INFO
var driverAddress, driverLng, driverLat;
var customerData;
var customerName;
var customerAddress, customerLat, customerLng;
var destinationAddress, destinationLat, destinationLng;

//USER MAP 
var fromAddress, toAddress;

//SERVICE
var serviceStatus = false;
var timer;
var interval = 5000;
var updateCheck = 0;
var myMarker = [];
var polyline = [];
var poly2 = [];
var poly = null;
var startLocation = [];
var endLocation = [];
var timerHandle = [];
var distance;
var duration;
var pathComplete = false;
var emulateDriver = false;
var routeNumber = 0;
var fare = 5;

function initMap(location) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7749, lng: -122.4194},
    zoom: 15,
    mapTypeId: 'roadmap'
  });
  geocoder = new google.maps.Geocoder();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setUserCurrentLocation);
  }
  else{
    location.reload();
  }
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
          hideRouteList: true
  });
  directionsDisplay.setMap(map);
  geocoder = new google.maps.Geocoder();
}

function calculateAndDisplayRoute(){
  console.log("calculating route");
  getTrafficPath(); //CALCULATE AND DISPLAYS PATH
  //storeLongLat(); //STORE USER's PICKUP LOCATION + DESTINATION
  //clearPickUpLocationMarkers(); 
  //clearDestinationMarkers();        
}

function getTrafficPath() {  
  //console.log(toAddress);
  //console.log(fromAddress);       
  var temptoAddress = toAddress;
  temptoAddress = temptoAddress.replace(/,/g,"");
  temptoAddress = temptoAddress.replace(/ /g,"+");

  var tempfromAddress = fromAddress;
  tempfromAddress = tempfromAddress.replace(/,/g,"");
  tempfromAddress = tempfromAddress.replace(/ /g,"+");

  var newUrl = 'https://maps.googleapis.com/maps/api/directions/json?origin='+tempfromAddress+
            '&destination='+temptoAddress+'&departure_time=now&mode=driving&alternatives=true&travel_model=optimistic&key=AIzaSyCprZ188mVif2fk-gao8Tv3glyWkLaM59E';
  $.ajax({
    url: 'php/proxy.php',
    async:true,
    type: "POST",
    dataType: "json",
    data: {
      url:newUrl
    },
    success: function (result) {
      //console.log(JSON.parse(result));
      displayDirections(JSON.parse(result));
    },
    error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
    }
  });
}

function displayDirections(data) {
  var i = data.routes.length;
  console.log("Displaying directions\n");
  //console.log("# of routes: " +i);
  var fastestIndex = 0;
  var fastestPath = data.routes[i-1].legs[0].duration_in_traffic.value;
  //FIND FASTEST ROUTE
  while(i--) {
    //console.log("route "+i +": "+data.routes[i].legs[0].duration_in_traffic.value+"seconds");
    if(data.routes[i].legs[0].duration_in_traffic.value < fastestPath) {
      fastestIndex = i;
      fastestPath = data.routes[i].legs[0].duration_in_traffic.value;
    }
  } 

  //var displayTimeDistance = document.getElementById("timeAndDistance");
  distance = (data.routes[fastestIndex].legs[0].distance.value * 0.000621371).toFixed(1);
  //console.log(distance);
  duration = (data.routes[fastestIndex].legs[0].duration_in_traffic.value / 60).toFixed(0);
  //console.log(duration);

  //displayTimeDistance.innerHTML = "";
  //displayTimeDistance.innerHTML += "Distance: " + distance + "mi Duration: about" + duration +" minutes"
  var routename = data.routes[fastestIndex].summary; //USED CURRENTLY FOR COMPARE
  //console.log(routename);
  var date =  new Date();

  //DRAW ROUTE, MATCH BY ROUTE SUMMARY
  directionsService.route({
    origin: fromAddress,
    destination: toAddress,
    travelMode: 'DRIVING',
    drivingOptions:{
      departureTime: date
    },
    provideRouteAlternatives: true
  },
  function(response, status) {
    var i;
    for(i = 0; i < response.routes.length; i++)
    {
      //console.log(response.routes[i].summary);
      if(response.routes[i].summary == routename)
      {
        routeNumber = i;
    document.getElementById("fourthPanel").style.display = "none";
        //$('.secondPanel').show();
    document.getElementById("secondPanel").style.display = "block";
        directionsDisplay.setDirections(response);
        directionsDisplay.setRouteIndex(i);
        directionsDisplay.setMap(map);

        if(emulateDriver) {
          //console.log("hello");
          var bounds = new google.maps.LatLngBounds();
          var route = response.routes[0];
          startLocation[i] = new Object();
          endLocation[i] = new Object();

          polyline[i] = new google.maps.Polyline({
          path: [],
          strokeColor: '#FFFF00',
          strokeWeight: 0
          });

          poly2[i] = new google.maps.Polyline({
          path: [],
          strokeColor: '#FFFF00',
          strokeWeight: 0
          });     

          var path = response.routes[i].overview_path;
          var legs = response.routes[i].legs;

          for (j=0;j<legs.length;j++) {
                if (j == 0) { 
                  startLocation[i].latlng = legs[j].start_location;
                  startLocation[i].address = legs[j].start_address;
                  // marker = google.maps.Marker({map:map,position: startLocation.latlng});
                  myMarker[i] = createMarker(legs[j].start_location,"start",legs[j].start_address,"green");
                }
                endLocation[i].latlng = legs[j].end_location;
                endLocation[i].address = legs[j].end_address;
                var steps = legs[j].steps;

                for (k=0;k<steps.length;k++) {
                  var nextSegment = steps[k].path;                
                  var nextSegment = steps[k].path;

                  for (l=0;l<nextSegment.length;l++) {
                      polyline[i].getPath().push(nextSegment[l]);
                      //bounds.extend(nextSegment[k]);
                  }

                }
          }
          polyline[i].setMap(map);
          startAnimation(i); 
        } 
        i = response.routes.length;
      }
    }
  });
}

function startService() {
  console.log("Trying to start service.");
  
  document.getElementById("firstPanel").style.display = "none";
  document.getElementById("fourthPanel").style.display = "block";
  
  navigator.geolocation.getCurrentPosition(setUserCurrentLocation); 
  if(serviceStatus == false) {
    serviceStatus = true;
    $.ajax({
      url: "php/addDriver.php", 
      method: "post",
      data: {address: driverAddress, lat: driverLat, lng: driverLng},
      success: function(data){
        if(data != false)
        {          
          console.log(data);
          timer = setTimeout(getCustomer(), interval); //begin searching for customer
        }
        else {
          console.log(data);
        }
      }
    }); 
  }
}

function getCustomer() {  
    $.ajax({
      url: "php/getCustomer.php", 
      method: "post",
      data: {driverAddress:driverAddress, driverLat : driverLat, driverLng : driverLng},
      success: function(data) {
          if(data == false){
            clearTimeout(timer);
            timer = 0;
            console.log("Finding Customer");
            timer = setTimeout(getCustomer(), interval);
          }
          else {
            clearTimeout(timer);
            timer = 0;
            console.log("Customer found");
            customerData = jQuery.parseJSON(data); 
            //console.log(data);
            customerID = customerData.customerID;
            customerName = customerData.name;
            customerLng = customerData.customerLng;
            customerLat = customerData.customerLat;
            customerAddress = customerData.customerAddress;
            toAddress = customerAddress;

            destinationLng = customerData.destinationLng;
            destinationLat = customerData.destinationLat;
            destinationAddress = customerData.destinationAddress;

            navigator.geolocation.getCurrentPosition(setUserCurrentLocation); 
            fromAddress = driverAddress;
            emulateDriver = true;
            calculateAndDisplayRoute();
            console.log("Getting to customer");
            console.log(fare);
            timer = setTimeout(getToCustomer(), interval);

          }
      }
    });
}

function getToCustomer() {
	            console.log(fare);
            console.log(distance);
            fare = 5 + Number(distance);
    //navigator.geolocation.getCurrentPosition(setUserCurrentLocation); 
    $.ajax({
      url: "php/getToCustomer.php", 
      method: "post",
      data: {customerID: customerID, driverLng: driverLng, driverLat: driverLat, driverAddress: driverAddress, customerLat: customerLat, customerLng : customerLng, custAddress: customerAddress},
      success: function(data) {
		  //console.log(data);
          if(data != true){
            console.log("Getting to customer");
            //console.log(data);
            clearTimeout(timer);
            timer = 0;
            timer = setTimeout(getToCustomer(), interval);
          }
          else if(data == true && pathComplete == true){
            clearTimeout(timer);
            timer = 0;
            console.log("Waiting for confirmation");
            timer = setTimeout(waitForConfirm(), interval);
          }
          else {
            console.log("Getting to customer");
            //console.log(data);
            clearTimeout(timer);
            timer = 0;
            timer = setTimeout(getToCustomer(), interval);
          }
      }
    });
}

function waitForConfirm() {
   $.ajax({
      url: "php/checkConfirm.php", 
      method: "post",
      data: {customerID: customerID},
      success: function(data) {
        if(data != true) {
          console.log("Waiting for confirmation");
          clearTimeout(timer);
          timer = 0;
          timer = setTimeout(waitForConfirm(), interval);
        }
        else {
          clearTimeout(timer);
          timer = 0;
          fromAddress = toAddress;
          toAddress = destinationAddress;
          console.log("Customer pick-up confirmed, driving to destination");
          myMarker[routeNumber].setMap(null);
          calculateAndDisplayRoute();
        }
      }
    });
}
function stopService() {
  if(serviceStatus == true) {
     $.ajax({
      url: "php/removeDriver.php", 
      method: "post",
      data: {driverAddress: driverAddress},
      success: function(data){
        if(data != false) {
          console.log(data);
      }
      else {
        console.log("You have not started the service yet");
      }
      }
    });  
    clearTimeout(timer);
    serviceStatus = false;
  }
}

function setUserCurrentLocation(position){
  if(userCurrMarker != null) userCurrMarker.setMap(null);
  pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
  map.setCenter(pos);
  map.setZoom(15);
  userCurrMarker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: 'https://i.imgur.com/mQ94NuU.png'
          });
  geocoder.geocode({'latLng': userCurrMarker.position}, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    if (results[0]) {
      driverAddress = results[0].formatted_address;
      driverLng = userCurrMarker.position.lng();
      driverLat = userCurrMarker.position.lat();
      //console.log(driverAddress +driverLng +" "+driverLat);
    }
  }
});
}

//Functions for when driver click the "Confirm Picked Up" button
function driverConfirmedPickUp(){
  if(pathComplete == true) {
  $.ajax({
      url: "php/driverConfirmPickUp.php", 
      method: "post",
      data: {customerID: customerID},
      success: function(data){
        if(data == false)
        {           
          console.log("Cannot confirm pickup yet");
        }
        else {  
          pathComplete = false; 
          console.log("Confirmed pickup");
          document.getElementById("secondPanel").style.display = "none";
          document.getElementById("thirdPanel").style.display = "block";
        }
      }
    });
   }
   else console.log("Cannot confirm pickup yet");
}

//Functino for when driver click the "COnfirm Ride End" button
function driverConfirmedEnd(){
  //This section is for code to change status of the ride in trans table. Need to confirm what code to use first
  //console.log("Attempting to change status of ride to end");
 
 if(pathComplete == true) {
 console.log(fare);
 fare += Number(distance);
 console.log("Calculated fare: " + fare);
  $.ajax({
      url: "php/driverConfirmRideEnd.php", 
      method: "post",
      data: {customerID: customerID, fare: fare},
      success: function(data){
        if(data == false)
        {           
          console.log("Cannot confirm drop-off yet");
        }
        else {
          pathComplete = false; 
          console.log("Confirmed ride ended.");
          document.getElementById("secondPanel").style.display = "none";
          document.getElementById("thirdPanel").style.display = "none";
          document.getElementById("firstPanel").style.display = "block";
          navigator.geolocation.getCurrentPosition(setUserCurrentLocation);
          directionsDisplay.setMap(null); 
          myMarker[routeNumber].setMap(null);
          serviceStatus = false;
        }
      }
    });
 }
 else console.log("Cannot confirm drop-off yet");
}

//Function for when driver click "Change Role" button
function driverChangeRole(){
  
  driverCancel();
  
  console.log("Proceeding to change the page.");
  //Code to change pages
  
}

//Function for when driver click the "Cancel" button
function driverCancel(){
  
  //Call database through Ajax and remove from rdyDriv table and change trans table state code
  
  //clearInterval(timer);
  //console.log("Testing function.");
  driverAddress = "";

  $.ajax({
      url: "php/driverCancel.php", 
      method: "post",
      data: {driverAddress: driverAddress},
      success: function(data){
        console.log(data);
        if(data != false)
        {          
          console.log("Canceled successfully.");
          console.log(data);
        }
        else {
          console.log("Cancel unsuccessful.");
        }
      }
    });
  
  document.getElementById("secondPanel").style.display = "none";
  document.getElementById("thirdPanel").style.display = "none";
  document.getElementById("firstPanel").style.display = "block";
}

//Function for when driver click "signout" button
//Function for when driver click "signout" button
function driverSignOut(){
  
  driverCancel();
  window.location = "signout.php";
  //Code to destroy(?) session
  //Code to change current page to the index page 
  
}


function createMarker(latlng, label, html) {
  //console.log("createMarker");
// alert("createMarker("+latlng+","+label+","+html+","+color+")");
    var contentString = '<b>'+label+'</b><br>'+html;
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: label,
        zIndex: Math.round(latlng.lat()*-100000)<<5
        });
        marker.myname = label;

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString); 
        infowindow.open(map,marker);
        });
    return marker;
}  


    var lastVertex = 1;
    var stepnum=0;
    var step = 50; // 5; // metres
    var tick = 100; // milliseconds
    //var tick = duration*60000; // milliseconds // time
    //var step = (distance*1609.34)/tick; // 5; // metres // distance 
    var eol= [];


//----------------------------------------------------------------------                
 function updatePoly(i,d) {
 // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
    if (poly2[i].getPath().getLength() > 20) {
          poly2[i]=new google.maps.Polyline([polyline[i].getPath().getAt(lastVertex-1)]);
          // map.addOverlay(poly2)
        }

    if (polyline[i].GetIndexAtDistance(d) < lastVertex+2) {
        if (poly2[i].getPath().getLength()>1) {
            poly2[i].getPath().removeAt(poly2[i].getPath().getLength()-1)
        }
            poly2[i].getPath().insertAt(poly2[i].getPath().getLength(),polyline[i].GetPointAtDistance(d));
    } else {

        poly2[i].getPath().insertAt(poly2[i].getPath().getLength(),endLocation[i].latlng);
    }
 }
//----------------------------------------------------------------------------

function animate(index,d) {
  //console.log("animate"+index+" "+d);
  //console.log("d: " + d + " eol[index]: " + eol[index]);
   if (d>eol[index]) {
      myMarker[index].setPosition(endLocation[index].latlng);
      console.log("complete");
      pathComplete = true;
      return;
   }
    var p = polyline[index].GetPointAtDistance(d);

    map.panTo(p);
    //console.log(p);

    myMarker[index].setPosition(p);
    updatePoly(index,d);
    timerHandle[index] = setTimeout("animate("+index+","+(d+step)+")", tick);
}

//-------------------------------------------------------------------------

function startAnimation(index) {
  tick = (distance*1609.34)/(duration*60000);
  console.log(tick);
  step = tick*100;
  console.log(tick);
  console.log("start animation");
        if (timerHandle[index]) clearTimeout(timerHandle[index]);
        eol[index]=polyline[index].Distance();
        map.setCenter(polyline[index].getPath().getAt(0));

        poly2[index] = new google.maps.Polyline({path: [polyline[index].getPath().getAt(0)], strokeColor:"#FFFF00", strokeWeight:3});

        timerHandle[index] = setTimeout("animate("+index+",50)",2000);  // Allow time for the initial map display
}

//----------------------------------------------------------------------------         