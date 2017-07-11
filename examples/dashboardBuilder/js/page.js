Nave.registerPage('hello', function(state) {
    var lb = Nave.layouts('nvBase');
    return {
        id: "hello",
        layout: lb.nvParagraph,
        text: state.message
    }
})