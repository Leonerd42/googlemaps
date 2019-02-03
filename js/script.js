
    // Mapa 
    var map; 
    var geocoder;
    var ContMarkers = 0; 
    var MarkersArray = [];
    var directionsDisplay; 
    var directionsService; 

    // Coordenadas de Bauru - SP
    var BauruCoordinate = {
        lat: -22.322081, 
        lng: -49.071152
    };

    // Opções do mapa 
    var options = {
        center: BauruCoordinate, 
        zoom: 13, 
        streetViewControl: false
    }

    // Função para iniciar o mapa do google 
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), options);       
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsService = new google.maps.DirectionsService(); 
        directionsDisplay.setMap(map); 

        geocoder = new google.maps.Geocoder();

        //document.getElementById('submit').addEventListener('click', 
        //function() {
          //geocodeAddress(geocoder, map);
        //});
    }

    function geocodeAddress(geocoder, resultsMaps, address){
        //var address = document.getElementById('address').value;
        var marker;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMaps.setCenter(results[0].geometry.location);
              marker = new google.maps.Marker({
              map: resultsMaps,
              position: results[0].geometry.location, 
              title: address
            });
            var object = {
                lat: results[0].geometry.location.lat(), 
                lgn:  results[0].geometry.location.lng(),
                title: address
            }
          } else {
            alert('Geocode was not successful for the following reason: ' + status + 'endereço: ' + address);
          }
          MarkersArray[ContMarkers++] = object;
        });
    }

    document.getElementById('exceldata').addEventListener('change', function(){
        //console.log('opa');
        ListarEnderecos(); 
    });

    // Função de teste
    function ListarEnderecos(){
        //alert("olá");
        var data = document.getElementById('exceldata').value;

        var rows = data.split(";");

        $('#colarEndereco').empty(); 

        console.log(rows);
        //Criando as inputs com os valores de cada um 
        for(var i=0; i<rows.length; i++){
            console.log(rows[i]);
            if(rows[i].length != 0)
                $('#listarEndereco').append('<div class="form-group"> \
                <input class="form-control" name="listaDeEnderecos" value="' + rows[i].trim() + '">\
                </div>');
        }
        $('#listarEndereco').append('<div class="form-group"> \
        <label for="cidade"> Escolha a Cidade <label>\
        <select id="cidade" class="form-control">\
        <option selected value="Bauru"> Bauru </option> \
        <option value="Agudos"> Agudos </option> \
        </selected> \
        </div>');
        $('#listarEndereco').append('<button class="btn btn-primary" onclick="MarcarLugares()"> Calcular </button>')
    }

    function MarcarLugares(){
        var bairrosAtualizados = document.getElementsByName('listaDeEnderecos');
        var lerCidade = document.getElementById('cidade').value; 
        //Adicionar um marcador para cada endereço 
        for(var i=0; i<bairrosAtualizados.length; i++){
            var endereco = bairrosAtualizados[i].value + " " + lerCidade; 
            geocodeAddress(geocoder, map, endereco);
        }

        console.log(MarkersArray);
        CalcRouter();
        //Calcular rota 
    }

    function CalcRouter(){
        console.log(MarkersArray.lat);

        //var start = new google.maps.LatLng(MarkersArray[0].lat, MarkersArray[0].lng);
        //var end = new google.maps.LatLng(MarkersArray[1].lat, MarkersArray[1].lng);

        /*

        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status){
            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(response);
            }
        });*/

    }