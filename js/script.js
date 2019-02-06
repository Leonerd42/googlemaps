    
    // Variaveis importantes 
    var map; 
    var geocoder;
    var MarkersArray = [];
    var directionsDisplay; 
    var directionsService; 

    // MATRIZ DISTANCIA DE TODOS OS VÉRTICES 
    var DistanceMatriz = [];

    // Objeto de origem do sistema
    var MarkerOfOrigin; 

    // Coordenadas de Bauru - SP
    var BauruCoordinate = {
        lat: -22.322081, 
        lng: -49.071152
    };
    // Coordenadas NETDIGIT TELECOM - Origem 
    var NetdigitCoordinate = {
        lat: -22.336824,
        lng: -49.063288
    };
    // Opções do mapa 
    var options = {
        center: BauruCoordinate, 
        zoom: 13, 
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
    }

    // Função para calcular a distancia da origem para todos os outros vértices 
    function TodasAsDistancias(){

        // Percorrer o vetor de marcadores e retornar a distancia para um outro vetor 

        DistanceMatriz = MarkersArray.map(function(origem){
            var newArray = MarkersArray.map(function(destino){
                var distance; 
                CalcularDistanciaXY(origem, destino)
                .then(function(result){
                    console.log(result);
                    console.log('Tempo de viagem: ' + result.duration);
                    console.log('Distancia de viagem: ' + result.distance);
                    distance = result.distance;
                })
                .catch(function(err){
                    console.log("Algum erro: " + err);
                }); 
                return distance;
            });
            return newArray;
        });

        

        /*var VetorDistancia = MarkersArray.map(function(item){
            var newArray = MarkersArray.map(function(newItem){
                return CalcularDistanciaXY(item, newItem);
            });
            return newArray;
        }); 
          
        console.log(VetorDistancia);  */

        Promise.all( DistanceMatriz )
        .then(function(results){

            console.log(DistanceMatriz);
        })
        .catch(function(err){

        });
    }

    // Retornar o objeto rota do google maps 
    function CalcularDistanciaXY(inicio, destino){
        return new Promise(function(resolve, reject){
            var start = new google.maps.LatLng(inicio.lat, inicio.lng);
            var end = new google.maps.LatLng(destino.lat, destino.lng);

            var request = {
                origin: start, 
                destination: end, 
                travelMode: google.maps.TravelMode.DRIVING
            };

            // A promessa retorna o objeto da rota se o status == OK
            directionsService.route(request, function(response, status){
                if(status == google.maps.DirectionsStatus.OK){

                    // Objeto legivel 
                    var dadosRota = {
                        distance: response.routes[0].legs[0].distance.text,
                        origin: {
                            lat: response.routes[0].legs[0].start_location.lat(),  
                            lng: response.routes[0].legs[0].start_location.lng()
                        }, 
                        destination:{ 
                            lat: response.routes[0].legs[0].end_location.lat(), 
                            lng: response.routes[0].legs[0].end_location.lng()
                        },
                        duration: response.routes[0].legs[0].duration.text
                    }
                    resolve(dadosRota);
                }else{
                    // Se não for OK, a promessa é rejeitada 
                    reject(JSON.stringify(google.maps.DirectionsStatus));
                }
            });
        });
    }

    // Função para adicionar os markers e retornar as posições no MarkersArray
    function MarcarLugares(){
        // Lendo os bairros com as inputs corrigadas 
        var bairrosAtualizados = document.getElementsByName('listaDeEnderecos');
        // Lendo a cidade em que haverá a busca
        var lerCidade = document.getElementById('cidade').value; 
        
        // Criando um array de promise
        var promisseArray = [];

        // Adicionando um marcador para cada bairro buscado 
        bairrosAtualizados.forEach(function(item){
            var endereco = item.value + " " + lerCidade;
            // Geocode Adress Retorna uma promise
            promisseArray.push(GeocodeAdress(geocoder, map, endereco));
        });

        // Esperando todas as promessas serem cumpridas 
        Promise.all(promisseArray)
        .then(function(resolve){
            // Calcula as rotas caso todos os endereços forem encontrados 
            TodasAsDistancias()
        })
        .catch(function(reject){
            // Trata o erro 
        });         
    }   

    /************************************************
     * 
     *          FUNÇÕES DO GOOGLE MAPS API
     * 
     ***********************************************/

     // Função para iniciar o mapa do google 
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), options);       
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsService = new google.maps.DirectionsService(); 
        directionsDisplay.setMap(map); 

        geocoder = new google.maps.Geocoder();

        //Criar um marcador para a origem 
        var marker = new google.maps.Marker({
            position: NetdigitCoordinate, 
            map: map, 
            title: "Netdigit Telecom"
        });

        MarkerOfOrigin = {
            lat: marker.position.lat(),
            lng: marker.position.lng(), 
            title: "Origem"
        };
        MarkersArray.push(MarkerOfOrigin);
    }

    //Nova função geocode como promessa 
    function GeocodeAdress(geocoder, resultsMaps, address){
        return new Promise(function(resolve, reject){
            // Função do google maps API para encontrar o endereço passado 
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
                        lng:  results[0].geometry.location.lng(),
                        title: address
                    }
                    MarkersArray.push(object);
                    //Promisse fullfilled
                    resolve('Marker Adicionado');
                } else {
                  alert('Geocode was not successful for the following reason: ' + status + 'endereço: ' + address);
                  //Promisse failed 
                  reject('Falha');
                }
            });
        });
    }

    /************************************************
     * 
     *           FUNÇÕES PARA INTERFACE 
     * 
    ************************************************/

    // Função para listar os endereços adicionados no textArea
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
    /***********************************************
     * 
     *                  LISTENERS 
     * 
     **********************************************/

    // Listener de quando for colado os endereços 
    document.getElementById('exceldata').addEventListener('change', function(){
        ListarEnderecos(); 
    });