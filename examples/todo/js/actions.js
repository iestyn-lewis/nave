// This is our action library, which we'll use to respond
// to user events.  We register an action library with the Nave.registerActions method,
// which takes a name for our action library, and a function.  The function should return
// an object which contains the methods for the action library.
Nave.registerActions('todo', function(state, update) {
    // Each function here will have access to the current state of the application.
    // They can do what they want to it, and at the end, if they
    // want to update the application, they call the update function which
    // was passed in, passing in state.
    return {
        addItem: function(item) {
            state.todos.push(item);
            update(state);
        },
        deleteItem: function(index) {
            if (index == state.editItemIndex) {
                state.editItemIndex = -1;
            }
            state.todos.splice(index, 1);
            update(state);
        },
        setEditItem: function(index) {
            state.editItemIndex = index;
            update(state);  
        },
        editItem: function(index, item) {
            state.todos[index] = item;
            if (state.editItemIndex == index) {
                state.editItemIndex = -1;            
            }
            update(state);
        },
        cancelEdit: function() {
            state.editItemIndex = -1;
            update(state);
        }
    }
})

// We register a listener, which will be called any time
// the state changes.  We'll just keep a copy of the whole
// state in local storage.  That way the user can pick up where they
// left off when they restart the app.
Nave.registerListener('localStorage', function(state) {
    Nave.services('local').save('todo_state', state);
})