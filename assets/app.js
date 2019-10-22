// Codigo para generar queryURL del API de Giphy para el GIF que se va a mostrar en la Waiting Screen y ajax para obtenerlo y mostrarlo en el HTML

var waitingOponentGIFURL = "https://api.giphy.com/v1/gifs/search?q=rock+paper+scissors&api_key=1Z2LDJcUvfiJbely9XEE26yKOEKf4I0V&limit=1&rating=pg-13" 
$.ajax({url: waitingOponentGIFURL, method: "GET"}).then(function(response) {
        var gifResultURL = response.data[0].images.original.url;
        newFigElement = $("<figure>");
        newFigElement.addClass("figure border border-dark");
        newHtmlElement = $("<img>");
        newHtmlElement.addClass("figure-img mb-0");
        newHtmlElement.attr("src",gifResultURL);
        newHtmlElement.attr("id","waitingGIF");
        newHtmlElement.appendTo(newFigElement);
        newFigElement.appendTo($("#gifElement"));
  });

//---------------------------------------------------------------------------------------------------------------------
//                                         INICIALIZACION DE FIREBASE
//---------------------------------------------------------------------------------------------------------------------

var firebaseConfig = {
      apiKey: "AIzaSyCW5PSTTRvLuMm7tscT6bZnW2KjMwe7Ilc",
      authDomain: "rps-multiplayer-82681.firebaseapp.com",
      databaseURL: "https://rps-multiplayer-82681.firebaseio.com",
      projectId: "rps-multiplayer-82681",
      storageBucket: "rps-multiplayer-82681.appspot.com",
      messagingSenderId: "1002135245395",
      appId: "1:1002135245395:web:e2647442681916f9622ca6"
};

    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    database.ref("/results/player1").remove();
    database.ref("/results/player2").remove();
    database.ref("/game").remove();
    database.ref("/restartGame").set(false);
    database.ref("/chat").remove();


//---------------------------------------------------------------------------------------------------------------------
//                                         FUNCIONES
//---------------------------------------------------------------------------------------------------------------------

//1. Funcion para mostrar pantalla de espera con el GIF en caso de que solo haya un usuario dentro
function showWaitScreen(){
      if(!$("#welcomeScreenContainer").hasClass("d-none")){
            $("#welcomeScreenContainer").addClass("d-none");
      }
      if($("#waitingScreenContainer").hasClass("d-none")){
            $("#waitingScreenContainer").removeClass("d-none");
      }
      if(!$("#playingScreenContainer").hasClass("d-none")){
            $("#playingScreenContainer").addClass("d-none");
      }
}

//2. Funcion para mostrar pantalla de bienvenida en caso de que un usuario se desconecte
function showWelcScreen(){
      if($("#welcomeScreenContainer").hasClass("d-none")){
            $("#welcomeScreenContainer").removeClass("d-none");
      }
      if(!$("#waitingScreenContainer").hasClass("d-none")){
            $("#waitingScreenContainer").addClass("d-none");
      }
      if(!$("#playingScreenContainer").hasClass("d-none")){
            $("#playingScreenContainer").addClass("d-none");
      }
}

//3. Funcion para mostrar pantalla de juego cuando ya se tenga a dos usuarios con sesion iniciada
function showPlayScreen(){
      if(!$("#welcomeScreenContainer").hasClass("d-none")){
            $("#welcomeScreenContainer").addClass("d-none");
      }
      if(!$("#waitingScreenContainer").hasClass("d-none")){
            $("#waitingScreenContainer").addClass("d-none");
      }
      if($("#playingScreenContainer").hasClass("d-none")){
            $("#playingScreenContainer").removeClass("d-none");
      }
      if(userID===1){
            if($("#player1Col").hasClass("d-none")){
                  $("#player1Col").removeClass("d-none");
            }
            if(!$("#player2Col").hasClass("d-none")){
                  $("#player2Col").addClass("d-none");
            }
      }
      else if(userID===2){
            if(!$("#player1Col").hasClass("d-none")){
                  $("#player1Col").addClass("d-none");
            }
            if($("#player2Col").hasClass("d-none")){
                  $("#player2Col").removeClass("d-none");
            }
      }
      if(!$("#playAgainBttnRow").hasClass("d-none")){
            $("#playAgainBttnRow").addClass("d-none");
      }
}

//4. Funcion para reiniciar todas las variables y los iconos seleccionados en el HTML/DOM para que se pueda empezar otra partida sin perder los valores de WINS/LOSSES/DRAWS de la BD
function newGame(){
      playerPlayed = false; //nos dice si el usuario de la DOM ya selecciono opcion
      playerPick =""; 
      opponentPick = "";
      pickedElement = "";
      gameEnd = false;
      $("#player1GameChoiceIconCol").empty();
      $("#player2GameChoiceIconCol").empty();
      $("#player1GameEnemyIconCol").empty();
      $("#player2GameEnemyIconCol").empty();
      showPlayScreen();
      database.ref("/restartGame").set(false);
      database.ref("/game/player1").remove();
      database.ref("/game/player2").remove();
      
      if($("#player1GameEnemySpinnerRow").hasClass("d-none")){
            $("#player1GameEnemySpinnerRow").removeClass("d-none")
      }
      if($("#player2GameEnemySpinnerRow").hasClass("d-none")){
            $("#player2GameEnemySpinnerRow").removeClass("d-none")
      }
      player1PickDB = "";
      player2PickDB = "";
}

//5. Funcion para crear el icono de la opcion seleccionada por el usuario
function createChoice(playerPick){
      pickedElement = $("<i>");
      pickedElement.attr("id", "pickedIcon");
      pickedElement.attr("data-player", userID);
      pickedElement.addClass("mt-4");
      if(playerPick==="rock"){
            pickedElement.addClass("far fa-hand-rock fa-3x");
      }
      else if (playerPick==="paper"){
            pickedElement.addClass("fas fa-scroll fa-3x");
      }
      else if(playerPick==="scissors"){
            pickedElement.addClass("fas fa-cut fa-3x");
      }
      pickedElement.appendTo($("#player" + userID + "GameChoiceIconCol"));
}

//6. Funcion para crear el icono seleccionado por el oponente
function createOppChoice(opponentPick){
      $("#player" + userID + "GameEnemyIconCol").empty()      
      oppElement = $("<i>");
      oppElement.attr("id", "oppIcon");
      oppElement.attr("data-player", userID);
      oppElement.addClass("mt-4")

      if(opponentPick==="rock"){
            oppElement.addClass("far fa-hand-rock fa-3x");
      }
      else if (opponentPick==="paper"){
            oppElement.addClass("fas fa-scroll fa-3x");
      }
      else if(opponentPick==="scissors"){
            oppElement.addClass("fas fa-cut fa-3x");
      }
      oppElement.appendTo($("#player" + userID + "GameEnemyIconCol"));
      if(!$("#player1GameEnemySpinnerRow").hasClass("d-none")){
            $("#player1GameEnemySpinnerRow").addClass("d-none")
      }
      if(!$("#player2GameEnemySpinnerRow").hasClass("d-none")){
            $("#player2GameEnemySpinnerRow").addClass("d-none")
      }
}

//7. Funcion para crear/actualizar la tabla de resultados
function createResults(P1Name,P1Wins,P1Draws,P1Losses,P2Name,P2Wins,P2Draws,P2Losses){
      var resultElement = $("<table>");
      resultElement.addClass("table table-striped");

      var resultElementHead = $("<thead>");
      resultElementHead.appendTo(resultElement);

      var resultElementHeadRow = $("<tr>");
      resultElementHeadRow.appendTo(resultElementHead);
      var resultElementHeadCol1 =$("<th>");
      resultElementHeadCol1.text("Name");
      resultElementHeadCol1.appendTo(resultElementHeadRow);
      var resultElementHeadCol2 =$("<th>");
      resultElementHeadCol2.text("Wins");
      resultElementHeadCol2.appendTo(resultElementHeadRow);
      var resultElementHeadCol3 =$("<th>");
      resultElementHeadCol3.text("Draws");
      resultElementHeadCol3.appendTo(resultElementHeadRow);
      var resultElementHeadCol4 =$("<th>");
      resultElementHeadCol4.text("Losses");
      resultElementHeadCol4.appendTo(resultElementHeadRow);
      var resultElementHeadCol5 =$("<th>");
      resultElementHeadCol5.text("Overall");
      resultElementHeadCol5.appendTo(resultElementHeadRow);

      var resultElementBody = $("<tbody>");
      resultElementBody.appendTo(resultElement);

      var resultElementU1Row = $("<tr>");
      resultElementU1Row.attr("id", "resultsUser1Row");
      resultElementU1Row.appendTo(resultElementBody);
      var resultU1Name = $("<td>");
      resultU1Name.attr("id", "resultU1Name");
      resultU1Name.text(P1Name);
      resultU1Name.appendTo(resultElementU1Row);
      var resultU1Wins = $("<td>");
      resultU1Wins.attr("id", "resultU1Wins");
      resultU1Wins.text(P1Wins);
      resultU1Wins.appendTo(resultElementU1Row);
      var resultU1Draws = $("<td>");
      resultU1Draws.attr("id", "resultU1Draws");
      resultU1Draws.text(P1Draws);
      resultU1Draws.appendTo(resultElementU1Row);
      var resultU1Losses = $("<td>");
      resultU1Losses.attr("id", "resultU1Losses");
      resultU1Losses.text(P1Losses);
      resultU1Losses.appendTo(resultElementU1Row);
      var resultU1Overall = $("<td>");
      resultU1Overall.attr("id", "resultU1Overall");
      resultU1Overall.text(P1Wins*1 + P1Draws*0 + P1Losses*(-1));
      resultU1Overall.appendTo(resultElementU1Row);

      var resultElementU2Row = $("<tr>");
      resultElementU2Row.attr("id", "resultsUser2Row");
      resultElementU2Row.appendTo(resultElementBody);
      var resultU2Name = $("<td>");
      resultU2Name.attr("id", "resultU2Name");
      resultU2Name.text(P2Name);
      resultU2Name.appendTo(resultElementU2Row);
      var resultU2Wins = $("<td>");
      resultU2Wins.attr("id", "resultU2Wins");
      resultU2Wins.text(P2Wins);
      resultU2Wins.appendTo(resultElementU2Row);
      var resultU2Draws = $("<td>");
      resultU2Draws.attr("id", "resultU2Draws");
      resultU2Draws.text(P2Draws);
      resultU2Draws.appendTo(resultElementU2Row);
      var resultU2Losses = $("<td>");
      resultU2Losses.attr("id", "resultU2Losses");
      resultU2Losses.text(P2Losses);
      resultU2Losses.appendTo(resultElementU2Row);
      var resultU2Overall = $("<td>");
      resultU2Overall.attr("id", "resultU2Overall");
      resultU2Overall.text(P2Wins*1 + P2Draws*0 + P2Losses*(-1));
      resultU2Overall.appendTo(resultElementU2Row);
      $("#overAllScoreCol").empty();
      resultElement.appendTo($("#overAllScoreCol"))
}

//---------------------------------------------------------------------------------------------------------------------
//                                         DECLARACION DE VARIABLES
//---------------------------------------------------------------------------------------------------------------------
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var qtyOfUsers = 0;
var userIDState = false;
var userID = "";
var clickedStart = false;
var playerPlayed = false; //nos dice si el usuario de la DOM ya selecciono opcion
var playerPick =""; 
var opponentPick = "";
var pickedElement = "";
var player1PickDB = "";
var player2PickDB = "";
var wins = 0;
var draws = 0;
var looses = 0;
var gameEnd = false;
var messageCounter = 0;

//---------------------------------------------------------------------------------------------------------------------
//                                         EVENTOS
//---------------------------------------------------------------------------------------------------------------------

// 0.Evento para detectar nuevas conecciones en el nodo connections de la BD y en caso de desconexion quitar conexiones
connectedRef.on("value", function(snap) {
      if (snap.val()) {
            var con = connectionsRef.push(true);
            con.onDisconnect().remove();
      }
});


//1. Evento que detecta cambios en las conexiones, asigna numero de usuario a cada sesion y en caso de desconexion de un usuario regresa a pantalla de bienvenida 
connectionsRef.on("value", function(snapshot) {
      qtyOfUsers = snapshot.numChildren();
      if(userIDState===false){
            userID = qtyOfUsers;
            userIDState = true;
            if(userID===1){
                        database.ref("/results/startClicks/startClick1/clickedStart").set(false)
                        database.ref("/results/startClicks/startClick2/clickedStart").set(false)
            }
            else if(userID===2){
                        database.ref("/results/startClicks/startClick2/clickedStart").set(false)
            }
      }

      if(userID === 1){
            var thisUserClickedStart = snapshot.child("/results/startClicks/startClick1/clickedStart").val();
            var otherUserClickedStart = snapshot.child("/results/startClicks/startClick2/clickedStart").val();
      }
      else{
            var thisUserClickedStart = snapshot.child("/results/startClicks/startClick2/clickedStart").val();
            var otherUserClickedStart = snapshot.child("/results/startClicks/startClick1/clickedStart").val();
      }

      if(thisUserClickedStart===true && otherUserClickedStart === true && qtyOfUsers===2){
            showPlayScreen();
      }
      if(!$("#playingScreenContainer").hasClass("d-none") && qtyOfUsers < 2){
            qtyOfUsers = 0;
            userIDState = false;
            userID = "";
            clickedStart = false;
            playerPlayed = false; //nos dice si el usuario de la DOM ya selecciono opcion
            playerPick =""; 
            opponentPick = "";
            pickedElement = "";
            player1PickDB = "";
            player2PickDB = "";
            wins = 0;
            draws = 0;
            looses = 0;
            gameEnd = false;
            showWelcScreen();
      }
});


//2. Evento para detectar el click en Start y dependiendo de si hay dos usuarios mandar a Waiting Screen o bien ya mandar a la pantalla de juego con el Player 1 o el Player 2 abierto dependiendo de que usuario es el que esta viendo el DOM
$("#startButton").on("click", function(){
      if($("#userNameInput").val()!=""){
            clickedStart = true;
            database.ref("/results/name" + userID).set({name : $("#userNameInput").val()})
            database.ref("/results/startClicks/startClick" + userID).set({clickedStart : true})
      }
      else{
            $("#noNameModal").modal("show");
      }
      
});

//3. Evento para detectar click en cualquiera de las 3 opciones de juego de los dos usuarios y actualizar la seleccion hacia la BD
$(".optionButtonP").on("click", function(){
      if(playerPlayed===false){
            playerPlayed=true;
            playerPick = $(this).attr("data-choice");
            createChoice(playerPick);
            if(userID === 1){
                  database.ref("/game/player1").set({
                        "pick": playerPick
                  })
            }
            else if(userID === 2){
                  database.ref("/game/player2").set({
                        "pick": playerPick
                  })
            }
      }
})

//4. Evento para detectar cuando los dos usuarios ya jugaron, actualizar BD, revisar quien gano/empato/perdio
database.ref().on("value", function(snapshot){

      var scrsht = snapshot.val();
      if(snapshot.hasChild("game")){
            if(snapshot.hasChild("game/player1/pick")){
                  player1PickDB = snapshot.child("game/player1/pick").val();
            };
            if(snapshot.hasChild("game/player2/pick")){
                  player2PickDB = snapshot.child("game/player2/pick").val();
            }
      }

      if(playerPlayed && player1PickDB != "" && player2PickDB != "" && !gameEnd){
            gameEnd = true;
            if(userID===1){
                  createOppChoice(player2PickDB);
                  var localUserPick = player1PickDB;
                  var oppUserPick = player2PickDB;
            }
            else{
                  createOppChoice(player1PickDB);
                  var localUserPick = player2PickDB;
                  var oppUserPick = player1PickDB;
            }
            if(userID===1){
                  wins = snapshot.child("/results/player1/numOfWins").val();
                  draws = snapshot.child("/results/player1/numOfDraws").val();
                  looses = snapshot.child("/results/player1/numOfLosses").val();
            }
            else if(userID===2){
                  wins = snapshot.child("/results/player2/numOfWins").val();
                  draws = snapshot.child("/results/player2/numOfDraws").val();
                  looses = snapshot.child("/results/player2/numOfLosses").val();
            }

            // Se calculan perdidas, ganadas y empatadas
            if((localUserPick === "rock" && oppUserPick === "paper") || (localUserPick === "paper" && oppUserPick === "scissors") || (localUserPick === "scissors" && oppUserPick === "rock")){
                  looses = looses + 1;
            }
            else if((localUserPick === "rock" && oppUserPick === "scissors") || (localUserPick === "paper" && oppUserPick === "rock") || (localUserPick === "scissors" && oppUserPick === "paper")){
                  wins = wins + 1;
            }
            else if(localUserPick === oppUserPick){
                  draws = draws + 1;
            }
            // Se empuja hacia firebase los resultados
            if(userID===1){
                  database.ref("/results/player1").set({
                        numOfWins: wins,
                        numOfDraws: draws,
                        numOfLosses: looses
                  })
            }
            else if(userID===2){
                  database.ref("/results/player2").set({
                        numOfWins: wins,
                        numOfDraws: draws,
                        numOfLosses: looses
                  })
            }
            $("#playAgainBttnRow").removeClass("d-none");
      }
});

//5. Evento para detectar cuando hay escritura de resultados hacia la BD y crear la tabla de resultados con la funcion createResults
database.ref("/results").on("value", function(snapshot){
            createResults(
                  snapshot.child("/name1/name").val(),
                  snapshot.child("/player1/numOfWins").val(),
                  snapshot.child("/player1/numOfDraws").val(),
                  snapshot.child("/player1/numOfLosses").val(),
                  snapshot.child("/name2/name").val(),
                  snapshot.child("/player2/numOfWins").val(),
                  snapshot.child("/player2/numOfDraws").val(),
                  snapshot.child("/player2/numOfLosses").val()
            )
})

//6. Evento para detectar cuando dan click en el boton de playAgain, registrar la bandera true en restartGame en la BD para que con otro evento reiniciemos juego en las dos sesiones
$("#playAgainButton").on("click", function(){
      database.ref("/restartGame").set(true);
})

//7. Evento para detectar cuando hay cambios en el nodo de restartGame, en caso de que restartGame es = true entonces reinicia el juego con la funcion newGame
database.ref("/restartGame").on("value", function(snapshot){
      if(snapshot.val()===true){
            newGame();
      }
})

//8. Evento para detectar desde la base de datos si los dos usuarios ya dieron click y mandar a pantalla de juego o a pantalla de espera
database.ref().on("value", function(snapshot){
      if(snapshot.child("connections").numChildren()<=2){
            if(userID === 1 && snapshot.child("/results/startClicks/startClick1/clickedStart").val() === true && snapshot.child("/results/startClicks/startClick2/clickedStart").val() === false){
                  showWaitScreen();
            }
            else if(userID === 2 && snapshot.child("/results/startClicks/startClick1/clickedStart").val() === false && snapshot.child("/results/startClicks/startClick2/clickedStart").val() === true){
                  showWaitScreen();
            }
            else if(snapshot.child("/results/startClicks/startClick1/clickedStart").val() === true && snapshot.child("/results/startClicks/startClick2/clickedStart").val() === true){
                  showPlayScreen();
            }
      }
      else if(snapshot.child("connections").numChildren()>2 && userID > 2){
            $("#tooManyUsers").modal("show");
      }
})

//9. Evento para cachar el texto del mensaje cuando alguien le da submit al chat y enviarlo a la base de datos
$("#chatSubmitButton").on("click", function(){
      event.preventDefault();
      if($("#chatInputText").val()!=""){
            messageCounter++
            database.ref("/chat/message" + messageCounter).set({
                  userID: userID,
                  message: $("#chatInputText").val()
            })
            database.ref("/chat/messageCounter").set(messageCounter);
            $("#chatInputText").text("");
      }
})

//10. Evento para cachar cambios en todo la base de datos para loggear los ultimos 3 mensajes que se han enviado al chat
database.ref().on("value", function(snapshot){
      var qtyOfMessages = snapshot.child("chat").child("messageCounter").val()
      var snpsht = snapshot.val();

      $("#chatBoxCol").empty()
      
      var msg1 = snapshot.child("chat").child("message" + (qtyOfMessages)).child("message").val();
      var msg1User = snapshot.child("chat").child("message" + (qtyOfMessages)).child("userID").val();
      var msg1UserName = snapshot.child("results").child("name" + msg1User).child("name").val()
      if(msg1 && msg1User && msg1UserName){
            var msg1Element = $("<p>")
            msg1Element.text(msg1UserName + ": " + msg1);
            msg1Element.prependTo($("#chatBoxCol"))
      }
      

      var msg2 = snapshot.child("chat").child("message" + (qtyOfMessages-1)).child("message").val();
      var msg2User = snapshot.child("chat").child("message" + (qtyOfMessages-1)).child("userID").val();
      var msg2UserName = snapshot.child("results").child("name" + msg2User).child("name").val()
      if(msg2 && msg2User && msg2UserName){
            var msg2Element = $("<p>")
            msg2Element.text(msg2UserName + ": " + msg2);
            msg2Element.prependTo($("#chatBoxCol"))
      }

      var msg3 = snapshot.child("chat").child("message" + (qtyOfMessages-2)).child("message").val();
      var msg3User = snapshot.child("chat").child("message" + (qtyOfMessages-2)).child("userID").val();
      var msg3UserName = snapshot.child("results").child("name" + msg3User).child("name").val()
      if(msg3 && msg3User && msg3UserName){
            var msg3Element = $("<p>")
            msg3Element.text(msg3UserName + ": " + msg3);
            msg3Element.prependTo($("#chatBoxCol"))
      }
})