//TODO: 
      // Let user pick what location to search near
        // Option1: current location, using geocoding
        // Option2: center of map
        // Option3: enter address
          // geocode address and verify result with user
          // center map on address

      // Allow user to enter the names of the places??
        // OR use default list of places

      // Display results as list?
        // Order by distance

      // Figure out what search radius makes sense

      // Refactor/restructure code
var mainMod =(function(window, undefined) {
      var map;
      var infoWindow;
      var vendors = ['Bancomer', 'Banorte', 'Telecom'];
      var colors = ['blue', 'red', 'green', 'yellow', 'purple'];
      var color;

      function initMap() {
        var mapDiv = document.getElementById('map');

        var mapOptions = {
            center: {lat: 19.432608, lng: -99.133209},
            zoom: 14,
            // styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"off"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
            styles: [{ "featureType": "administrative.land_parcel", "elementType": "geometry.fill", "stylers": [ { "hue": "#ff0000" }, { "visibility": "off" } ] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [ { "visibility": "on" }, { "color": "#e0e5ef" } ] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [ { "visibility": "on" }, { "hue": "#1900ff" }, { "color": "#c0e8e8" } ] }, { "featureType": "poi", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "lightness": 100 }, { "visibility": "simplified" } ] }, { "featureType": "road", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "transit", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "transit.line", "elementType": "geometry", "stylers": [ { "visibility": "on" }, { "lightness": 700 } ] }, { "featureType": "transit.line", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "water", "elementType": "all", "stylers": [ { "color": "#7dcdcd" } ] }, { "featureType": "water", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }] };
        map = new google.maps.Map(mapDiv, mapOptions);

        infowindow = new google.maps.InfoWindow({map: map});

      }

      function geolocate(map) {
        

          // Try HTML5 geolocation.
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };

              infowindow.setPosition(pos);
              infowindow.setContent('Location found.');
              map.setCenter(pos);
            }, function() {
              handleLocationError(true, infowindow, map.getCenter());
            });
          } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infowindow, map.getCenter());
          }
        }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }


      function findLocations(vendors, map) {

        console.log('finding locations');

        service = new google.maps.places.PlacesService(map);

        // for (var i = 0; i < vendors.length; i++) {
        //   var request = {
        //       location: map.center,
        //       radius: '900',
        //       name: vendors[i]
        //     };
          
        //   service.nearbySearch(request, callback);
        // }

        vendors.forEach(function(vendor){


          var request = {
              location: map.center,
              radius: '900',
              name: vendor
            };
          
          service.nearbySearch(request, callback);
        
          });
        
        function callback(results, status) {

          console.log(results);


          // Get the next color in the color array and assign it to color variable
          currentColor = colors.indexOf(color);
          color = colors[currentColor+1];

          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              var place = results[i];

              // Filter out permanently closed places
              if (place.permanently_closed == true) {
                  console.log(place.name + ' is permanently closed.');
              }
              else if (place.name.toLowerCase().indexOf('cajero') != -1) {
                console.log(place.name + ' is an atm');
              }

              else {
                createMarker(results[i], color, map);
              }
              
            }
          }
        }

      }

      function createMarker(place, color, map) {

        // console.log(place.name);
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: place.geometry.location,
          icon: 'icons/marker-15-' + color +'.svg'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });

        console.log('marker: ' + marker.getIcon());
      }


      function start() {
        initMap();

        geolocate(map);

        findLocations(vendors, map);
      }

      return { start: start };
} )( window );

