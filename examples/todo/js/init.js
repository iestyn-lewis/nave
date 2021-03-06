$(document).ready(function() {
   // In the init section, we want to create or load our initial state, and 
   // then start Nave by calling setState. 

   // Create a blank state object -  just the required nave object with the required page value,
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

   // pass our new or saved state to Nave for processing
   Nave.setState(state);
});