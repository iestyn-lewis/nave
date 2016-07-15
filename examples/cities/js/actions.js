Nave.registerActions('login', function(state, updateFn) {
     return {
         login: function() {
            state.loading = true;
            state = updateFn(state);
            Nave.services('city').login(function(loginStatus) {
                state.authenticated = loginStatus;
                state = updateFn(state);
                Nave.services('city').getCities(function(cities) {
                    state.cities = cities;
                    state.loading = false;
                    updateFn(state);
                });                
          })
       }
    }
})

Nave.registerActions('city', function(state, updateFn) {
    return {
        delete: function(index) {
            state.cities.splice(index,1);
            state.selectedCityIndex = -1;
            updateFn(state);
        },
        new: function() {
            state.cities.push({name: "New City", population: 0, state: "New State", streets: []});            
            updateFn(state);
        }
    }
})

