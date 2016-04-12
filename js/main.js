window.onload = function(){
    var myMap;
    var coords = {
        lat: '',
        lon: ''
    }
    // determine user location
    /*function myPosition(){

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
            //console.log(e.get('target'));
            mw.modal('show');

            createPoint(coords[0].toFixed(6), coords[1].toFixed(6));
            //getAddress(coords[0].toFixed(3), coords[1].toFixed(3));
            /*if (!myMap.balloon.isOpen()) {
                var coords = e.get('coords');
                myMap.balloon.open(coords, {
                    contentHeader:'Событие!',
                    contentBody:'<p>Кто-то щелкнул по карте.</p>' +
                        '<p>Координаты щелчка: ' + [
                        coords[0].toPrecision(6),
                        coords[1].toPrecision(6)
                        ].join(', ') + '</p>',
                    contentFooter:'<sup>Щелкните еще раз</sup>'
                });
            }
            else {
                myMap.balloon.close();
            }*/
        });

        function createPoint(lat, lon) {
            console.log(lat, lon);
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
        var form = document.getElementById('feadback');

        btn.addEventListener('click', sendComment);

        function sendComment() {

            var data = {
                "op": "add",
                "review": {
                    "coords": {"x": 55.76048396289834, "y": 37.58335174560545},
                    "address": "Россия, Москва, Большая Грузинская улица, 8с36",
                    "name": "Сергей",
                    "place": "Шоколадница",
                    "text": "Кругом зомби!!!!",
                    "date": "2016.04.09 22:32:00"
                }
            }

            var xhr = new XMLHttpRequest();



            xhr.open('POST', 'http://localhost:3000/', true);
            //xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function() {
                console.log(xhr.response);
            }

            xhr.send(data);

            /*$('#feadback').on('submit', function(e){
                e.preventDefault();
                console.log(this);
                $.ajax({
                    type: 'POST',
                    url: 'some url',
                    dataType: 'json',
                    data: $(this).serialize(),
                    success: function(data){
                        console.log(data);
                    }
                })
            });*/

        }
    }
    
}
