
var host = window.document.location.host.replace(/:.*/, '');

var client = new Colyseus.Client(location.protocol.replace("http", "ws") + host + (location.port ? ':' + location.port : ''));

var room;
var role = '';
var players = {};


room = client.join("two_player_battle");


room.onJoin.add(function () {
    console.log(client.sessionId + ' joined!');
});

// // listen to patches coming from the server
room.onMessage.add(function(message) {
    console.log(message);
});


room.listen("players/:id", (change) => {  
    if (change.operation === "add") {
        console.log(change);
    } else if (change.operation === "remove") {
        console.log(change);
    } else if (change.operation === "replace") {
        console.log(change);
    }
});

room.listen("state/:id/:attribute", (change) => {
    if (change.operation === "add") {
        console.log(change);
    } else if (change.operation === "remove") {
        console.log(change);
    } else if (change.operation === "replace") {
        if (change.path.attribute === "ready_countdown") {
            document.getElementById('timer').innerHTML = `${change.value.toFixed(2)}`;
        }
        if (change.path.attribute === "countdown") {
            document.getElementById('timer').innerHTML = `${change.value.toFixed(2)}`;
        }
        if (change.path.attribute === "state") {
            switch (change.value) {
                case 1:
                    document.getElementById('state').innerHTML = `Ready...`;
                    break;
                case 2:
                    document.getElementById('state').innerHTML = `Go!!!`;
                    break;
                case 3:
                    document.getElementById('state').innerHTML = `Game Over`;
                    break;
            }
        }
        
    }
});

room.listen("positions/:id/cart/position/:prop", (change) => {
    console.log(change.path.id);
});
room.listen("positions/:id/cart/rotation/:prop", (change) => {
    console.log(change);
});
room.listen("positions/:id/head/position/:prop", (change) => {
    console.log(change.path.id);
});
room.listen("positions/:id/head/rotation/:prop", (change) => {
    console.log(change);
});
room.listen("positions/:id/rightHand/position/:prop", (change) => {
    console.log(change.path.id);
});
room.listen("positions/:id/rightHand/rotation/:prop", (change) => {
    console.log(change);
});
room.listen("positions/:id/leftHand/position/:prop", (change) => {
    console.log(change.path.id);
});
room.listen("positions/:id/leftHand/rotation/:prop", (change) => {
    console.log(change);
});

room.listen("wallPapers/:id/wallPaper/:id", (change) => {
    console.log(change);
    if (change.operation == "add") {
        var id = change.value.id - 1;
        var table = document.getElementById("wallpapertable");
        var row = table.insertRow(-1);
        var idCell = row.insertCell(0);
        var itemCell = row.insertCell(1);
        var stateCell = row.insertCell(2);
        var coolDownCell = row.insertCell(3);
        idCell.innerHTML = id;
        idCell.id = `id${id}`;
        itemCell.innerHTML = change.value.item;
        itemCell.id = `item${id}`;
        stateCell.innerHTML = change.value.state;
        stateCell.id = `state${id}`;
        coolDownCell.innerHTML = change.value.coolDown;
        coolDownCell.id = `cd${id}`;
    } 
});

room.listen("wallPapers/:id/wallPaper/:id/:attribute", (change) => {
    // console.log(change);
    if (change.operation == "replace" && change.path.attribute == "item") {
        document.getElementById(`item${change.path.id}`).innerHTML = change.value;
    }
    if (change.path.attribute == "state") {
        if (change.value === 0) {
            document.getElementById(`state${change.path.id}`).innerHTML = 'XX';
        } else {
            document.getElementById(`state${change.path.id}`).innerHTML = change.value;
        }
    }
    if (change.path.attribute == "coolDown") {
        document.getElementById(`cd${change.path.id}`).innerHTML = change.value;
    }
});


room.onError.add(function(err) {
    console.log("oops, error ocurred:");
    console.log(err);
});

function moving() {
    room.send({
        client_id: client.id,
        type: 'move',
        transform: {
            cart: {
                position: {
                    x: (Math.random() * 10) - 5,
                    y: 0.5,
                    z: (Math.random() * 10) - 5
                },
                rotation: {
                    x: (Math.random() * 720) - 360,
                    y: (Math.random() * 720) - 360,
                    z: (Math.random() * 720) - 360
                }
            },
            head: {
                position: {
                    x: (Math.random() * 10) - 5,
                    y: 0.5,
                    z: (Math.random() * 10) - 5
                },
                rotation: {
                    x: (Math.random() * 720) - 360,
                    y: (Math.random() * 720) - 360,
                    z: (Math.random() * 720) - 360
                }
            },
            rightHand: {
                position: {
                    x: (Math.random() * 10) - 5,
                    y: 0.5,
                    z: (Math.random() * 10) - 5
                },
                rotation: {
                    x: (Math.random() * 720) - 360,
                    y: (Math.random() * 720) - 360,
                    z: (Math.random() * 720) - 360
                }
            },
            leftHand: {
                position: {
                    x: (Math.random() * 10) - 5,
                    y: 0.5,
                    z: (Math.random() * 10) - 5
                },
                rotation: {
                    x: (Math.random() * 720) - 360,
                    y: (Math.random() * 720) - 360,
                    z: (Math.random() * 720) - 360
                }
            }
        }
    })
}

function stop() {
    return null;
}

function adHit() {
    room.send({
        client_id: client.id,
        type: 'adHit',
        wallpaper_id: Math.round(Math.random() * 6)
    });
}