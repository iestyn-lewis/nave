$(document).ready(function() {
   // Blank state -  just the required nave object with the required page value,
   // and an empty array of todos.  
   var state =  {
        nave: {
            page: 'todo'
        },
        todos: []
    };
    // check to see if we have any saved state from a previous session
    // We included the basic service library, which includes a service
    // for localStorage
   var local = Nave.services('local');
   if (local.exists('todo_state')) {
       state = local.get('todo_state');
   }
   // away we go
   Nave.setState(state);
});