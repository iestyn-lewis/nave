$(document).ready(function() {
   // Starting state  
   var state =  {
        nave: {
            page: 'boxes'
        },
        drawings: [
            {
                name: "Test Drawing",
                numRows: 1,
                numColumns: 2
            }
        ],
        currDrawing: 0,
        mode: 'run'
    };

    // check to see if we have any saved state from a previous session
    // We included the basic service library, which includes a service
    // for localStorage
   var local = Nave.services('local');
   if (local.exists('boxes_state')) {
       state = local.get('boxes_state');
   }

   // pass our new or saved state to Nave for processing
   Nave.setState(state);
});