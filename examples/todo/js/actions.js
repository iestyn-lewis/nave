// This is our action library, which we'll use to respond
// to user events.  Each function here will get a copy of current state.
// They can do what they want to it, and at the end, if they
// want to update the application, they call the update function which
// was passed in, passing in state.
Nave.registerActions('todo', function(state, update) {
    return {
        addItem: function(item) {
            state.todos.push(item);
            state.lastItemAdded = item;
            update(state);
        },
        deleteItem: function(index) {
            state.todos.splice(index, 1);
            update(state);
        },
        setEditItem: function(index) {
            state.editItemIndex = index;
            update(state);  
        },
        editItem: function(index, item) {
            state.todos[index] = item;
            state.editItemIndex = -1;
            update(state);
        }
    }
})

// We register a listener, which will be called any time
// the state changes.  We'll just keep a copy of the whole
// state in local storage.
Nave.registerListener('localStorage', function(state) {
    Nave.services('local').save('todo_state', state);
})