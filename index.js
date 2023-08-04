const http = require("http")
const express = require("express")
const cors = require("cors")
const socketio = require("socket.io")


const app = express()
app.use(cors())

const port = process.env.PORT

const users = [{}]

app.get("/", (req, res) => {
    res.send("WOW, server working")
})


const server = http.createServer(app)

const io = socketio(server)

io.on("connection", (socket) => {
    console.log("new connection")
    socket.on('joined', (data) => {
        users[socket.id] = data.user
        console.log(`${data.user} has joined`)
        socket.broadcast.emit('userJoined', { user: 'Admin', message: `${users[socket.id]} has joined` })
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat, ${users[socket.id]} ` })
    })
    socket.on('Disconnect', () => {
        console.log("user left the chat")
    })
    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', ({ user: users[id], message, id }))
    })
    socket.on('leave', ({ id }) => {
        socket.broadcast.emit('left', ({ user: 'Admin', message: `${users[id]} has left the group` }))
    })

})

server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})