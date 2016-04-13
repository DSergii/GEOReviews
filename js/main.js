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
        });

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

            myMap.geoObjects
                .add(myGeoObject);

            
            var myClusterer = new ymaps.Clusterer();
            myClusterer.add(myGeoObject);
            myMap.geoObjects.add(myClusterer);

        }

        function getAddress(lat, lon) {

            var aaa = ymaps.geocode([lat, lon]);
            console.log(aaa);
            var xhr = new XMLHttpRequest();

            xhr.open('GET', 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + lat + ',' + lon, true);

            xhr.onload = function() {
                //console.log(xhr.response);
            }

            xhr.send();
        }

        var btn = document.getElementById('submitBtn');
        var form = $('#feadback');
        var box = document.getElementsByClassName('list')[0];

        btn.addEventListener('click', sendComment);

        function sendComment() {
            var name = document.getElementById('name');
            var text = document.getElementById('place'); 
            var comm = document.getElementById('comment');
            /*var data = {
                "op": "add",
                "review": {
                    "coords": {"x": 55.76048396289834, "y": 37.58335174560545},
                    "address": "Россия, Москва, Большая Грузинская улица, 8с36",
                    "name": "Сергей",
                    "place": "Шоколадница",
                    "text": "Кругом зомби!!!!",
                    "date": "2016.04.09 22:32:00"
                }
            }*/

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

        getData();
        
        function getData() {
            var xhr = new XMLHttpRequest();


            xhr.open('POST', 'http://localhost:3100/', true);


            xhr.onload = function() {
                var data = JSON.parse(xhr.response);
                console.log(xhr.response);
                if(data){
                    console.log(data[saveData.review.address]);
                    var li = document.createElement('li');
                    li.innerHtml = data.address;
                    box.appendChild(li);
                }
            }

            var data = {
                op: "all"
            }

            xhr.send(JSON.stringify(data));
        }
    }
    
}
