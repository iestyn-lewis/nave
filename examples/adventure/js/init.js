$(document).ready(function() {
   var initialState = {
       nave: {
           page: "run"
       },
       rooms: {
        Entryway: {
            title: "Entryway",
            text: `You stand in a marble entryway.  Torches flicker on the walls. There are doors on 
                    the left, center and right walls.`,
            items: {},
            exits: {  
                left: {caption: "Take the left door", room: "Left"},
                right: {caption: "Take the right door", room: "Right"}, 
                center: {caption: "Take the center door", room: "Center"}
            },
            conditionalText: {},
            actions: {}
        },
        Left: {
            title: "Left Room",
            text: "You are in a room with a statue of a narwhal.  Water can be heard faintly in the distance.",
            items: {
               trident: {
                   name: "Poseidon's Trident", 
                   location: "There is a blue glowing trident on the far wall.", 
                   gettext: "Remove the trident from the wall",
                }  
            },
            exits: {
                entry: {caption: "Go back to the entryway", room: "Entryway"},
            },
            conditionalText: {},
            actions: {}
        },
        Center: {
            title: "Center Room",
            text: "You are in a room with a statue of a mountan goat.  Somewhere the wind whistles.",
            conditionalText: {
                haveCan: {
                    reqItem: "tincan",
                    text: "The goat looks longingly at your delicious tin can."
                }
            },
            actions: {
                goat: {
                    reqItem: "tincan",
                    text: "Feed the tin can to the goat",
                    removeItem: "tincan",
                    dropItems: {},
                    room: "Win"
                }
            },
            items: {},
            exits: {
                entry: {caption: "Go back to the entryway", room: "Entryway"}
            }
        },
        Right: {
            title: "Right Room",
            text: "You are in a room with a statue of a lizard.  The room is uncomfortably warm.",
            conditionalText: {
               haveTrident: {
                   reqItem: "trident",
                   text: "The lizard appears interested in your trident."                 
               }
            },
            items: {},
            exits: {
                entry: {caption: "Go back to the entryway", room: "Entryway"}
            },
            actions: {
                lizard: {
                    reqItem: "trident",
                    text: "Give the lizard the trident.",
                    removeItem: "trident",
                    dropItems: {
                        tincan: {
                            name: "Tin Can of Odysseus",
                            location: "The lizard offers you an old tin can he has been saving.",
                            gettext: "Take the tin can"
                        }
                    }
                }
            }
        },
        Win: {
            title: "You Win!",
            text: "The goat accepts your gracious offer of the tincan, and grants you safe passage from his realm.  Congratulations!",
            hideActions: true,
            exits: {},
            items: {},
            actions: {},
            conditionalText: {}
        } 
      },
      inventory: {},
      currentRoom: "Entryway", 
      edit: {
          currentRoom: "",
          currentExit: "",
          currentConditionalText: "",
          currentItem: "",
          currentAction: "",
          currentActionDropItem: "",
          currentEditTab: "room"
      }
   };
   Nave.setState(initialState);
});