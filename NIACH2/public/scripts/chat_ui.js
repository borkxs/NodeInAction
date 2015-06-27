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
        scrollToBottom()
    })

    socket.on('featureResult', function(result){
        var message

        if (result.success)
            message = 'Feature Request: ' + result.message + '.'
        else
            mesage = result.message

        $('#messages').append(divEscapedSystemContent(message))
        scrollToBottom()
    })

    socket.on('joinResult', function(result) {
        $('#room').text(result.room)
        $('#messages').append(divSystemContentElement('Room changed.'))
        scrollToBottom()
    })

    socket.on('message', function(message) {
        // var newElement = $('<div></div>').text(message.text)
        $('#messages').append(cashTag(message.text))
        $('#messages').scrollTop($('#messages').prop('scrollHeight'))
    })

    socket.on('rooms', function(rooms) {
        $('#room-list').empty()

        for (var room in rooms) {
            room = room.substring(1, room.length)
            if (room != '') {
                $('#room-list').append(divEscapedContentElement(room))
                scrollToBottom()
            }
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
function div(content) {
    return $('<div></div>').html(content)
}
function span(content) {
    return $('<span></span>').text(content)
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
        $('#messages').append(cashTag(message))
        scrollToBottom()
    }

    $('#send-message').val('')
}

function scrollToBottom(){
    $('#messages').scrollTop($('#messages').prop('scrollHeight'))
}

function cashTag(message){
    var div = $('<div></div>'),
        temp = $('<div></div>')

    message.split(/ +/).map(function(x){
        if (!!x.match(/\$/))
            return '<a href="javascript:;">' + temp.text(x).text() + '</a>'
        else if (isUrl(x))
            return '<a href="' + x + '">' + temp.text(x).text() + '</a>'
        else return span(x)
    }).forEach(function(x){
        div.append(' ')
        div.append(x)
    })//.join(' ')

    return div
}

function isUrl(url) {
    return /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(url)
}