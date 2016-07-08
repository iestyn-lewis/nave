Nave.registerService('local', {     
    load : function(key) {
        return localStorage.getItem(key);
    }, 
    save : function(key, value) {
        localStorage.setItem(key, value);
    }
});