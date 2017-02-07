
Nave.registerActions('todo', function(state, updateFn) {
    var blankItem = {
        name: "",
        time: 5
    }
    return {
        newItem : function(parent) {
            var ret = Nave.copy(blankItem);
            ret.parent = parent;
            
        }
    }
})

Nave.registerListener('localStorage', function(state) {
    Nave.services('local').save('cbb_state', state);
})