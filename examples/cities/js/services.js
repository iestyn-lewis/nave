Nave.registerService('city', {     
    login : function(callback) {
        setTimeout(function(){callback(true)}, 2000);   
    }, 
    getCities : function(callback) {
        var cities = [
                {name: "Atlanta", population: 5000000, state: "Georgia", streets: ["Peachtree", "Piedmont"]}, 
                {name: "Chicago", population: 4000000, state: "Illinois", streets: ["Wacker", "Pennsylvania"]}, 
                {name: "Boston", population: 3000000, state: "Massachusetts", streets: ["Commonwealth", "Harvard"]}
        ];
        setTimeout(function(){callback(cities)}, 2000);
    },
    saveCity : function(callback) {
        setTimeout(function(){callback("success")}, 2000);
    }
});