var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.7749, lng: -122.42},
        zoom: 12


    });


    var controlDiv = document.createElement('div');
    controlDiv.style.backgroundColor= '#fff';
    controlDiv.innerHTML = 'Filter Map';
    
    var selectTag = document.createElement('select')
    var threebedroom = document.createElement('option')
    threebedroom.innerHTML = '3 Bedrooms'
    threebedroom.value="3"
    var fourbedroom = document.createElement('option')
    fourbedroom.innerHTML = '4 Bedrooms'
    fourbedroom.value="4"
    var fivebedroomplus = document.createElement('option')
    fivebedroomplus.innerHTML = '5 Bedrooms + '
    fivebedroomplus.value="5"

    selectTag.addEventListener("change", function(event){
        console.log(event.target.value)
        bedrooms = event.target.value
        clear_markers()
        display_markers()
    })

    selectTag.appendChild(threebedroom)
    selectTag.appendChild(fourbedroom)
    selectTag.appendChild(fivebedroomplus)
    controlDiv.appendChild(selectTag)

    var selectTag = document.createElement('select')
    var twobathroom = document.createElement('option')
    twobathroom.innerHTML = '2 Bathrooms'
    twobathroom.value = "2"
    var threebathroom = document.createElement('option')
    threebathroom.innerHTML = '3 Bathrooms'
    threebathroom.value = "3"
    var fourbathroomplus = document.createElement('option')
    fourbathroomplus.innerHTML = '4 Bathrooms + '
    fourbathroomplus.value = "4"

    selectTag.addEventListener("change", function(event) {
        bathrooms = event.target.value
        clear_markers()
        display_markers()
    })

    selectTag.appendChild(twobathroom)
    selectTag.appendChild(threebathroom)
    selectTag.appendChild(fourbathroomplus)
    controlDiv.appendChild(selectTag)

    var selectTag = document.createElement('select')
    var min = document.createElement('option')
    min.innerHTML = 'Min'
    min.value = "0"
    var mineight = document.createElement('option')
    mineight.innerHTML = '$800,000 '
    mineight.value = "800000"
    var million = document.createElement('option')
    million.innerHTML = '$1 Million'
    million.value = "1000000"
    var onefive = document.createElement('option')
    onefive.innerHTML = '$1.5 Million'
    onefive.value = "1500000"
    var twomillion = document.createElement('option')
    twomillion.innerHTML = '$2 Million'
    twomillion.value = "2000000"
    var twofive = document.createElement('option')
    twofive.innerHTML = '$2.5 Million'
    twofive.value = "2500000"
    var threemillion = document.createElement('option')
    threemillion.innerHTML = '$3 Million'
    threemillion.value = "3000000"
    var fourmillion = document.createElement('option')
    fourmillion.innerHTML = '$4 Million'
    fourmillion.value = "4000000"

    selectTag.addEventListener("change", function(event) {
        minPrice = event.target.value
        clear_markers()
        display_markers()
    })

    selectTag.appendChild(min)
    selectTag.appendChild(mineight)
    selectTag.appendChild(million)
    selectTag.appendChild(onefive)
    selectTag.appendChild(twomillion)
    selectTag.appendChild(twofive)
    selectTag.appendChild(threemillion)
    selectTag.appendChild(fourmillion)
    controlDiv.appendChild(selectTag)

    var selectTag = document.createElement('select')
    var max = document.createElement('option')
    max.innerHTML = 'Max'
    max.value = "0"
    var mineight = document.createElement('option')
    mineight.innerHTML = '$800,000'
    mineight.value = "800000"
    var million = document.createElement('option')
    million.innerHTML = '$1 Million'
    million.value = "1000000"
    var onefive = document.createElement('option')
    onefive.innerHTML = '$1.5 Million'
    onefive.value = "1500000"
    var twomillion = document.createElement('option')
    twomillion.innerHTML = '$2 Million'
    twomillion.value = "2000000"
    var twofive = document.createElement('option')
    twofive.innerHTML = '$2.5 Million'
    twofive.value = "2500000"
    var threemillion = document.createElement('option')
    threemillion.innerHTML = '$3 Million'
    threemillion.value = "3000000"
    var fourmillion = document.createElement('option')
    fourmillion.innerHTML = '$4 Million'
    fourmillion.value = "4000000"

    selectTag.addEventListener("change", function(event) {
        maxPrice = event.target.value
        clear_markers()
        display_markers()
    })

    selectTag.appendChild(max)
    selectTag.appendChild(mineight)
    selectTag.appendChild(million)
    selectTag.appendChild(onefive)
    selectTag.appendChild(twomillion)
    selectTag.appendChild(twofive)
    selectTag.appendChild(threemillion)
    selectTag.appendChild(fourmillion)
    controlDiv.appendChild(selectTag)

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);



    var transitLayer = new google.maps.TransitLayer();
    transitLayer.setMap(map);
    populate_markers()
}

var info = null;
var bedrooms = 3;
var bathrooms = 2;
var minPrice = null;
var maxPrice = null;
var allMarkers = [];

function populate_markers(){
    d3.json("/houses", function(data){
        info = data;
        display_markers()
    })
}

function clear_markers() {
    for (var i = 0; i < allMarkers.length; i++) {
        allMarkers[i].setMap(null)
    }
    allMarkers = [];
}

function display_markers() {
    if (info == null) {
        return
    }

    for (var i=0; i <info.length; i++){
        var house = info[i]
        var active_listing = (house["sold_price"] == "0")
        var marker_url = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"

        if (active_listing) {
            marker_url = "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        }
        
        var myLatlng = new google.maps.LatLng(house["latitude"],house["longitude"])
        let marker = new google.maps.Marker({
            position: myLatlng,
            title: house["address"],
            icon: {
                url:marker_url
            }
        });

        // Filtering:
        // - bedrooms
        if (bedrooms == "5") {
            if (house["bedroom"] < 5) {
                continue
            }
        } else if (house["bedroom"] != bedrooms) {
            continue
        }
        // - bathrooms
        if (bathrooms == "4") {
            if (house["bathroom"] < 4) {
                continue
            }
        } else if (house["bathroom"] != bathrooms) {
            continue
        }
        // - min price
        if (minPrice > 0) {
            if (house["Vanesstimate_raw"] < minPrice) {
                continue
            }
        }
        // - max price
        if (maxPrice > 0) {
            if (house["Vanesstimate_raw"] > maxPrice) {
                continue
            }
        }
        
        var contentString = "Address: " +house["address"] +
        "<br/>" +
        "Listing Price: $" + house["original_price"] +
        "<br/>" 
        if(!active_listing){
            contentString +="Sold Price: $" + house["sold_price"]+
            "<br/>" 
        }
        contentString+="Bedroom Count: " + house["bedroom"] +
        "<br/>" +
        "Bathroom Count: " +house["bathroom"] +
        "<br/>" +
        "Square Feet: " + house["sq_ft"] +
        "<br/>" +
        "Days On Market: " + house["days_on_market"] +
        "<br/>" +
        "Vanesstimate: " +house["Vanesstimate"] +
        "<br/>" +
        "URL: <a target='_blank' href='" + house["url"] +"'> Check out listing</a>"
        "<br/>"
        

        let infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        marker.addListener('click', function(){
            infowindow.open(map,marker);
        });
        marker.setMap(map);  

        allMarkers.push(marker)
    }
}

d3.json("/bar", function(info){

    console.log(info)
    
    var trace1 = {
        x:info["x"],
        y:info["y"],
        name: 'Average Sold Price by Neighborhood',
        type: 'bar'        
    };
    var layout = {
        barmode: 'group',
        xaxis: {type: "category"},
        title: "Average Sold Price by Neighborhood",

};
    Plotly.newPlot('bar', [trace1], layout);
})


d3.json("/percentage", function(info){

    console.log(info)
    
    var trace1 = {
        x:info["x"],
        y:info["y"],
        name: 'Percentage Over Asking by Neighborhood',
        type: 'bar'        
    };
    var layout = {
        barmode: 'group',
        xaxis: {type: "category"},
        title: "Percentage Over/Under Asking by Neighborhood",

    };
    Plotly.newPlot('percentage', [trace1], layout);
})
