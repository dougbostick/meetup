// let autocomplete;
let map;
let directionsService;
let directionsRenderer;
let dest;
let origin;
function initMap() {
  //geo
  const location = {
    lat: 40.0,
    lng: -79.0,
  };
  const options = {
    center: location,
    zoom: 12,
  };
  if (navigator.geolocation) {
    console.log("geo is here");
    navigator.geolocation.getCurrentPosition(
      (loc) => {
        location.lat = loc.coords.latitude;
        location.lng = loc.coords.longitude;
        map = new google.maps.Map(document.getElementById("map"), options);
      },
      (err) => {
        console.log("nope");
        map = new google.maps.Map(document.getElementById("map"), options);
      }
    );
  } else {
    console.log("get not supported");
    map = new google.maps.Map(document.getElementById("map"), options);
  }

  // new AutocompleteDirectionsHandler(map);
  // auto
  const autocompleteOrigin = new google.maps.places.Autocomplete(
    document.getElementById("origin-input"),
    {
      componentRestrictions: { country: ["us"] },
      fields: ["geometry", "name"],
      // types: ["establishment"],
    }
  );
  const autocompleteDest = new google.maps.places.Autocomplete(
    document.getElementById("destination-input"),
    {
      componentRestrictions: { country: ["us"] },
      fields: ["geometry", "name"],
      // types: ["establishment"],
    }
  );

  //add markers
  // autocomplete.addListener("place_changed", () => {
  //   const place = autocomplete.getPlace();
  //   new google.maps.Marker({
  //     position: place.geometry.location,
  //     title: place.name,
  //     map: map,
  //   });
  // });
  autocompleteOrigin.addListener("place_changed", () => {
    origin = autocompleteOrigin.getPlace();
    console.log(origin);
  });
  autocompleteDest.addListener("place_changed", () => {
    dest = autocompleteDest.getPlace();
    console.log(dest);
  });

  //directions
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById("sidebar"));

  const control = document.getElementById("floating-panel");

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  // const getRoute = document.getElementById("get_route");
  // getRoute.addListener("click", () => {
  //   console.log("get route");
  //   calculateAndDisplayRoute(directionsService, directionsRenderer);
  // });
  // const onChangeHandler = function () {
  //   calculateAndDisplayRoute(directionsService, directionsRenderer);
  // };

  // document
  //   .getElementById("origin-input")
  //   .addEventListener("place_changed", onChangeHandler);
  // document
  //   .getElementById("destination-input")
  //   .addEventListener("place_changed", onChangeHandler);
}

const findLastStep = (halfWay, dir) => {
  let total = 0;
  let newSteps = [];
  for (let i = 0; i < dir.length; i++) {
    let step = dir[i];
    newSteps.push(step);
    total += step.distance.value;
    if (total > halfWay) {
      console.log(i);
      console.log(newSteps);
      return newSteps;
    }
  }
};

const getRoute = document.getElementById("get_route");
getRoute.addEventListener("click", () => {
  console.log("get route");
  calculateAndDisplayRoute(directionsService, directionsRenderer);
});

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
    .route({
      origin: {
        query: origin.name,
      },
      destination: {
        query: dest.name,
        // query: "Amarillo",
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      console.log(response);
      const steps = response.routes[0].legs[0].steps;
      const distance = response.routes[0].legs[0].distance.value;
      const half = distance / 2;
      let last = findLastStep(half, steps);
      console.log(distance, half);
      console.log(steps);
      console.log(last);
      response.routes[0].legs[0].steps = last;
      // directionsRenderer.setDirections(response);
      //console.log(destination);
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}

window.initMap = initMap;
