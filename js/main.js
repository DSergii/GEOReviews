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
            console.log(coords);
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
    }
    
}
