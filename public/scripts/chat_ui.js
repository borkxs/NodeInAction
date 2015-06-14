var socket = io.connect()

$(document).ready(function() {
    var chatApp = new Chat(socket)

    socket.on('nameResult', function(result) {
        var message

        if (result.success)
            message = 'You are now known as ' + result.name + '.'
        else
            message = result.message

        $('#messages').append(divEscapedContentElement(message))
    })

    socket.on('featureResult', function(result){
        var message

        if (result.success)
            message = 'Feature Request: ' + message + '.'
        else
            mesage = result.message

        $('#messages').append(divEscapedSystemContent(message))
    })

    socket.on('joinResult', function(result) {
        $('#room').text(result.room)
        $('#messages').append(divSystemContentElement('Room changed.'))
    })

    socket.on('message', function(message) {
        var newElement = $('<div></div>').text(message.text)
        $('#messages').append(newElement)
        $('#messages').scrollTop($('#messages').prop('scrollHeight'))
    })

    socket.on('rooms', function(rooms) {
        $('#room-list').empty()

        for (var room in rooms) {
            room = room.substring(1, room.length)
            if (room != '')
                $('#room-list').append(divEscapedContentElement(room))
        }

        $('#room-list div').click(function() {
            chatApp.processCommand('/join ' + $(this).text())
            $('#send-message').focus()
        })
    })

    setInterval(function() {
        socket.emit('rooms')
    }, 1000)

    $('#send-message').focus()

    $('#send-form').submit(function() {
        processUserInput(chatApp, socket)
        return false
    })
})

function divEscapedContentElement(message) {
    return $('<div></div>').text(message)
}
function divEscapedSystemContent(message) {
    return $('<div></div>').append( $('<i></i>').text(message) )
}
function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>')
}

function processUserInput(chatApp, socket) {
    var message = $('#send-message').val(),
        systemMessage

    if (message.charAt(0) == '$') {
        systemMessage = chatApp.processCommand(message)
        if (systemMessage) {
            $('#message').append(divSystemContentElement(systemMessage))
            scrollToBottom()
        } else {
            normalMessage(message)
        }
    } else {
        normalMessage(message)
    }

    function normalMessage(message){
        chatApp.sendMessage($('#room').text(), message)
        $('#messages').append(divEscapedContentElement(message))
        scrollToBottom()
    }

    $('#send-message').val('')
}

function scrollToBottom(){
    $('#messages').scrollTop($('#messages').prop('scrollHeight'))
}