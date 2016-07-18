Nave.registerActions('room', function(state, updateFn) {
    return {
        doAction : function(action) {
            var currentRoom = state.rooms[state.currentRoom];
            var exit = currentRoom.exits[action];
            var actions = currentRoom.actions;
            var inventory = state.inventory;
            if (exit) {
                state.currentRoom = exit.room;
            }
            if (currentRoom.items) {
                var item = currentRoom.items[action];
                if (item) {
                    state.inventory[action] = item;
                    delete currentRoom.items[action];
                }                
            }
            if (actions) {
            var action = actions[action];
            if (action) {
                if (action.dropItems) {
                    Nave.each(action.dropItems, function(item, key) {
                        state.rooms[state.currentRoom].items = currentRoom.items || {};
                        state.rooms[state.currentRoom].items[key] = item;
                    })
                }
                if (action.removeItem) {
                    delete inventory[action.removeItem];
                }
                if (action.room) {
                    state.currentRoom = action.room;
                }
            }
            }
            updateFn(state);
        }
    }
})

Nave.registerActions('condText', function(state, updateFn) {
     return {
        current: function() {
            var ret = "";
            var currentRoom = state.rooms[state.currentRoom];
            var conditionalText = currentRoom.conditionalText;
            var inventory = state.inventory;
            if (conditionalText) {
                Nave.each(conditionalText, function(cond, key, index) {
                    if (cond.reqItem) {
                        if (Nave.exists(inventory, cond.reqItem)) {
                            ret = cond.text; 
                        }                
                    }
                })
            }
            return ret;
        }
    }
})

Nave.registerActions('actionFn', function(state, updateFn) {
    return {
        current: function() {
            var currentRoom = state.rooms[state.currentRoom];
            var exits = currentRoom.exits || {};
            var items = currentRoom.items || {};
            if (!Nave.empty(items)) {
                items = Nave.map(items, function(item) {
                    return {
                        caption: item.gettext
                    }
                })            
            }

            var ret = Nave.merge(exits, items);
            var actions = currentRoom.actions;
            var inventory = state.inventory;
            if (actions) {
                Nave.each(actions, function(action, key, index) {
                    if (action.reqItem) {
                        if (Nave.exists(inventory, action.reqItem)) {
                            ret[key] = {
                                caption: action.text} 
                        }                
                    }
                })
            }
            console.log(ret);
            return ret;    
        }
    }
})