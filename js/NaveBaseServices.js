Nave.registerService('local', {     
    get : function(key) {
        return JSON.parse(localStorage.getItem(key));
    }, 
    save : function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    exists : function(key) {
        return localStorage.getItem(key) ? true : false;
    }
});