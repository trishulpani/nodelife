var socket = io(); //connection to socket on server that hosts this page.


//when user presses start game button, hide the image, hide the button and 
//call socket api for default node.
$('#start-game').click(function() {

  $('#start-game').fadeOut("slow"); //hides the button

  $('#img-container').fadeOut("slow", function() { //hides the image and calls socket api

    $('#message-container').show();
    socket.emit('nextNode', {
      nodeId: 1
    });

  });

});



function addButtonChoices(btnChoice) {

  var div = $('<div class=\"btnChoices\"/>', {
      'data-role': 'fieldcontain'
    }),

    //Button definition for button to be added based on game flow.
    btn = $('<input/>', {
      type: 'button',
      value: btnChoice.btnText,
      id: btnChoice.nextNodeId,
      on: {
        click: function() {
          console.log('Next node ' + this.id);
          $('#messages').empty();
          $('#btnChoices').empty();
          socket.emit('nextNode', {
            nodeId: this.id
          });
        }
      }
    });

  btn.addClass('btn btn-default').appendTo(div);
  $('#messages:last-child').append(div);
}


//Messages are received via Socket and displayed
socket.on('msg', function(data) {

  console.log(data);

  var msgTextElem;

  //messages beginning with [ are considered to be displayed in green font.
  if (data.message.indexOf("[") != -1) {
    msgTextElem = $('<div class=\"message-text\"><p class=\"messageFiller\">' + data.message + '</p></div>');
  } else {
    msgTextElem = $('<div class=\"message-text\"><p>' + data.message + '</p></div>');
  }

  $('#messages').append(msgTextElem);

});

//EOM message type indicates that option buttons need to be displayed.
socket.on('eom', function(data) {
  console.log(data);
  data.buttonChoices.forEach(btnChoice => addButtonChoices(btnChoice));

 $(".btnChoices").get(0).scrollIntoView();

});