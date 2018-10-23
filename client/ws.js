
var host = window.document.location.host.replace(/:.*/, '');

var client = new Colyseus.Client(location.protocol.replace("http", "ws") + host + (location.port ? ':' + location.port : ''));

var room;
var role = '';
var players = {};


room = client.join("two_player_battle");


room.onJoin.add(function () {
    console.log('Welcome');
    document.getElementById('role').innerHTML = client.id;
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

room.listen("players/:id/:attribute", (change) => {  
    if (change.operation === "replace") {
        console.log(change);
        if (change.path.attribute == "score" && change.path.id == client.id) {
            document.getElementById('score').innerHTML = `Your score : ${change.value}`;
        }
        if (change.path.attribute == "status") {
            document.getElementById('status').innerHTML = `player state : ${change.value}`;
        }
    }
});

room.listen("state/:id/:attribute", (change) => {
    if (change.operation === "add") {
        console.log(change);
    } else if (change.operation === "remove") {
        console.log(change);
    } else if (change.operation === "replace") {
        if (change.path.attribute === "ready_countdown") {
            document.getElementById('timer').innerHTML = `${change.value}`;
        }
        if (change.path.attribute === "countdown") {
            document.getElementById('timer').innerHTML = `${change.value}`;
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
room.listen("positions/:id/rightHand/:attribute", (change) => {
    if (change.path.attribute == 'item' && change.path.id == client.id) {
        document.getElementById("rightHandItem").innerHTML = `right hand item : ${change.value}`;
    } else if (change.path.attribute == 'ammo'  && change.path.id == client.id) {
        document.getElementById("rightHandAmmo").innerHTML = `right hand ammo : ${change.value}`;
    }
});

room.listen("positions/:id/leftHand/:attribute", (change) => {
    if (change.path.attribute == 'item'  && change.path.id == client.id) {
        document.getElementById("leftHandItem").innerHTML = `left hand item : ${change.value}`;
    } else if (change.path.attribute == 'ammo'  && change.path.id == client.id) {
        document.getElementById("leftHandAmmo").innerHTML = `left hand ammo : ${change.value}`;
    }
});

room.listen("positions/:id/cart/position/:prop", (change) => {
    //console.log(change.path.id);
});
room.listen("positions/:id/cart/rotation/:prop", (change) => {
    //console.log(change);
});
room.listen("positions/:id/head/position/:prop", (change) => {
    //console.log(change.path.id);
});
room.listen("positions/:id/head/rotation/:prop", (change) => {
    //console.log(change);
});
room.listen("positions/:id/rightHand/position/:prop", (change) => {
    //console.log(change.path.id);
});
room.listen("positions/:id/rightHand/rotation/:prop", (change) => {
    //console.log(change);
});
room.listen("positions/:id/leftHand/position/:prop", (change) => {
    //console.log(change.path.id);
});
room.listen("positions/:id/leftHand/rotation/:prop", (change) => {
    //console.log(change);
});

room.listen("wallPapers/:id/wallPaper/:id", (change) => {
    // console.log(change);
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
    var dice = Math.round(Math.random() * 1);
    var hand = (Boolean(dice)) ? 'right' : 'left';
    room.send({
        client_id: client.id,
        type: 'adHit',
        wallpaper_id: Math.floor(Math.random() * 10),
        hand: hand
    });
}

function playerHit(target) {
    room.send({
        client_id: client.id,
        type: 'playerHit',
        target: target
    });
}

function scanned(killer) {
    room.send({
        client_id: client.id,
        type: 'scanned',
        killer: killer
    })
}

function fireRight() {
    room.send({
        client_id: client.id,
        type: 'fire',
        hand: 'right'
    });
}

function fireLeft() {
    room.send({
        client_id: client.id,
        type: 'fire',
        hand: 'left'
    });
}

function pressRight() {
    room.send({
        client_id: client.id,
        type: 'trigger',
        msg: 'RightTriggerPress'
    });
}

function pressLeft() {
    room.send({
        client_id: client.id,
        type: 'trigger',
        msg: 'LeftTriggerPress'
    });
}

function releaseRight() {
    room.send({
        client_id: client.id,
        type: 'trigger',
        msg: 'RightTriggerRelease'
    });
    console.log("RightTriggerRelease");
}

function releaseLeft() {
    room.send({
        client_id: client.id,
        type: 'trigger',
        msg: 'LeftTriggerRelease'
    });
    console.log("LeftTriggerRelease");
}