Nave.registerActions('nvBase', function(state, updateFn) {
    return {
        setPage : function(page) {
            state.nave.page = page;
            updateFn(state);
        }
    }
})
