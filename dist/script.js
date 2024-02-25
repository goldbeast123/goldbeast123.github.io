// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken = "pk.eyJ1IjoiZ2xhc3pjIiwiYSI6ImNscjZlaHo1ZjJka2YyaW15ZndicXpnamcifQ.oEfa-AO2gSpBlm8qZhucwA";

const map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/glaszc/clsxthkkv00c401qwcikxdttf',
  center: [-118.3, 34],
  zoom: 9
});

const data_url = "https://api.mapbox.com/datasets/v1/glaszc/clsgcbbjx0pcc1nn2tafjonop/features?access_token=pk.eyJ1IjoiZ2xhc3pjIiwiYSI6ImNscjZlaHo1ZjJka2YyaW15ZndicXpnamcifQ.oEfa-AO2gSpBlm8qZhucwA";

map.on('load', () => {
  map.addLayer({
    id: 'crimes',
    type: 'circle',
    source: {
      type: 'geojson',
      data: data_url 
    },
     paint: {
      'circle-radius': 7,
      'circle-color': [
        'match',
        ['get', 'Crime type'],
        'CHILD ABANDONMENT', '#ff0000', 
        'CHILD ABUSE (PHYSICAL) - AGGRAVATED ASSAULT', '#00ff00', 
        'CHILD ABUSE (PHYSICAL) - SIMPLE ASSAULT', '#0000ff', 
        'CHILD ANNOYING (17YRS & UNDER)', '#ffff00',  
        'CHILD NEGLECT (SEE 300 W.I.C.)', '#ff00ff',  
        'CHILD PORNOGRAPHY', '#00ffff', 
        'CHILD STEALING', '#ff8c00', 
        'LEWD/LASCIVIOUS ACTS WITH CHILD', '#808080', 
        '#808080' 
      ],
      'circle-opacity': 0.9
    }
  
});
  
    map.on('click', 'crimes', (e) => {
    const crimelocation = e.features[0].properties.LOCATION; 
    new mapboxgl.Popup()
      .setLngLat(e.features[0].geometry.coordinates)
      .setHTML(`<h3>Crime Location:</h3><p>${crimelocation}</p>`)
      .addTo(map);
  });

  
  //Slider interaction code goes below
  filterType = ['!=',['get','Crime type'],'placeholder']
  filterMonth = ['==',['get','Month'],"2021-01"]
  document.getElementById('slider').addEventListener('input', (event) => {
//Get the month value from the slider
  const month = parseInt(event.target.value);

  // get the correct format for the data
 formatted_month = '2021-' + ("0"+month).slice(-2)
  //Create a filter
  filterMonth = ['==', ['get', 'Month'], formatted_month]

  //set the map filter
  map.setFilter('crimes', ['all', filterMonth, filterType]); 

  // update text in the UI
  document.getElementById('active-month').innerText = month;
});
  //Radio button interaction code goes below
  document.getElementById('filters').addEventListener('change', (event) => {
  const type = event.target.value;
    console.log(type);
  // update the map filter
  if (type == 'all') {
    filterType = ['!=', ['get', 'Crime type'], 'placeholder'];
  } else if (type == 'abandonment') {
    filterType = ['==', ['get', 'Crime type'], 'CHILD ABANDONMENT'];  
  } else if (type == 'abuse aggravated'){
    filterType = ['==', ['get', 'Crime type'], 'CHILD ABUSE (PHYSICAL) - AGGRAVATED ASSAULT'];
  } else if (type == 'abuse simple') {
    filterType = ['==', ['get', 'Crime type'], 'CHILD ABUSE (PHYSICAL) - SIMPLE ASSAULT'];
  } else if (type == 'annoying') {
    filterType = ['==', ['get', 'Crime type'], 'CHILD ANNOYING (17YRS & UNDER)'];
  } else if (type == 'neglect') {
    filterType = ['==', ['get', 'Crime type'], 'CHILD NEGLECT (SEE 300 W.I.C.)'];
  } else if (type == 'pornography') {
    filterType = ['==', ['get', 'Crime type'], 'CHILD PORNOGRAPHY'];
  } else if (type == 'stealing') {
    filterType = ['==', ['get', 'Crime type'], 'CHILD STEALING'];
  } else if (type == 'lewd acts') {
    filterType = ['==', ['get', 'Crime type'], 'LEWD/LASCIVIOUS ACTS WITH CHILD'];
  } else {
    console.log('error');
  }
  map.setFilter('crimes', ['all', filterMonth, filterType]);
});

const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
  placeholder: "Search for places in Los Angelas", // Placeholder text for the search bar
  proximity: {
    longitude: -118.3,
    latitude: 34
  } // Coordinates of Los Angelas
});


map.addControl(geocoder, "top-right");
map.addControl(new mapboxgl.NavigationControl(), "top-right");
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-right"
);




  });