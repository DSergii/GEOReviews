window.onload = function(){
    var myMap;
    var saveData = {
        'review': {
            'coords': {
                'x': 0,
                'y': 0
            },
            'address': '',
            'name': '',
            'place': '',
            'text': '',
            'date': ''
        }
    }
    
    // determine user location
    /*
    var coords = {
        lat: '',
        lon: ''
    }
    function myPosition(){

        var coords = [];

        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        function success(position) {

            coords.lat = position.coords.latitude.toFixed(2);
            coords.lon = position.coords.longitude.toFixed(2);
 
        }

        function error(error){
            console.log('Code: ' + error.code + ' ' + error.message);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);

    }
    myPosition();*/

    var mw = $('#geo');

    ymaps.ready(init);

    function init () {

        myMap = new ymaps.Map('map', {
            center: [49.98, 36.25], // Харьков
            zoom: 13
        }, {
            searchControlProvider: 'yandex#search'
        }),
            clusterer = new ymaps.Clusterer({

            preset: 'islands#invertedVioletClusterIcons',

            groupByCoordinates: false,

            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false
        }),
            getPointData = function (index) {
                return {
                    balloonContentBody: 'Место <strong> ' + index + '</strong>',
                    clusterCaption: 'Отзыв <strong>' + index + '</strong>'
                };
        },
            getPointOptions = function () {
                return {
                    preset: 'islands#dotIcon'
                }
        };

        myMap.events.add('click', function (e) {
            var coords = e.get('coords');

            mw.modal('show');

            createPoint(coords[0].toFixed(6), coords[1].toFixed(6));

        });

        function createPoint(lat, lon) {

            ymaps.geocode([lat,lon])
                .then(function(data){
                    var street = data.geoObjects.get(0);
                    var name = street.properties.get('name');

                    saveData.review.coords.x = lat;
                    saveData.review.coords.y = lon;
                    saveData.review.address = name;

                });

            myGeoObject = new ymaps.GeoObject({
                // Описание геометрии.
                geometry: {
                    type: "Point",
                    coordinates: [lat, lon]
                },
                // Свойства.
                properties: {
                    //iconContent: 'Я тащусь',
                    //hintContent: 'Ну давай уже тащи'
                }
            }, {
                // Опции.
                // Иконка метки будет растягиваться под размер ее содержимого.
                preset: 'islands#blackStretchyIcon',
                // Метку можно перемещать.
                draggable: true
            });

            myMap.geoObjects.add(myGeoObject);

        }

        var btn = document.getElementById('submitBtn');
        var form = $('#feadback');
        var box = document.getElementsByClassName('list')[0];

        btn.addEventListener('click', sendComment);

        function sendComment() {
            var name = document.getElementById('name');
            var text = document.getElementById('place'); 
            var comm = document.getElementById('comment');

            saveData.op = 'add';
            saveData.review.name = name.value;
            saveData.review.place = text.value;
            saveData.review.text = comm.value;
            saveData.review.date = new Date();

            var xhr = new XMLHttpRequest();

            xhr.open('POST', 'http://localhost:3100/', true);

            xhr.onload = function() {
                console.log(xhr.response);
            }
            var ser = form.serialize();

            xhr.send(JSON.stringify(saveData));


        }

        function getData() {
            var xhr = new XMLHttpRequest();

            xhr.open('POST', 'http://localhost:3100/', true);

            xhr.onload = function() {
                var data = JSON.parse(xhr.response);
                console.log(xhr.response);
                var point = [],
                    clust = [],
                    count = 0;

                if(data){
                    
                    for (var i in data){
                        
                        point[count] = [data[i][0].coords.x, data[i][0].coords.y];

                        clust[count] = new ymaps.Placemark(point[count], getPointData(count), getPointOptions());
                        count++;
                        
                        var li = document.createElement('li');
                        li.innerHTML = data[i][0].address;
                        box.appendChild(li);
                        
                    }

                    clusterer.add(clust);
                    myMap.geoObjects.add(clusterer);
                    
                }
            }

            var data = {
                op: "all"
            }

            xhr.send(JSON.stringify(data));
        }

        getData();
        
    }
    
}
