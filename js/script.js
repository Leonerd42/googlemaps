    
    // Variaveis importantes 
    var map; 
    var geocoder;
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

    // Função para calcular as melhores rotas - SEM IMPLEMENTAÇÃO AINDA
    function CalcRouter(){  
        
        console.log(MarkersArray);

        console.log(MarkersArray[0]);
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
            CalcRouter();
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
                        lgn:  results[0].geometry.location.lng(),
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