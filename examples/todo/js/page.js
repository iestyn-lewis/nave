// We only have one page in our application.  Pages are meant
// to separate parts of your application with very different 
// functionality.  This app only does one thing, so we only
// need one page.

Nave.registerPage('todo', function(state, layouts) {
    // We pulled in the Nave base layouts library,
    // and it's the only set of layouts we'll be using
    var lb = layouts.nvBase;
    return {
        layout: lb.nvForm,
        title: "ToDo With Nave",
        form: {
            add: {
                layout: lb.nvInput,
                label: "New Item",
                value: "",
                action: "Nave.actions('todo').addItem(this.value); this.value='';"
            },
            existing: {
                layout: lb.nvTable,
                trigger: "todos",
                headers: ["ToDo List", ""],
                rows: Nave.mapArrToObj(state.todos, 
                    function(item, index) {
                        return 'todo_item_' + index;
                    },
                    function(item, index) {
                        return {
                            layout: lb.nvTableRow,
                            cols: {
                                colItem: {
                                    layout: lb.nvInput,
                                    value: item,
                                    action: "Nave.actions('todo').editItem(" + index + ", this.value)"
                                },
                                colDelete: {
                                    layout: lb.nvButton,
                                    classname: "btn btn-xs btn-danger",
                                    text: "X",
                                    onclick: "Nave.actions('todo').deleteItem(" + index + ")"
                                }
                            }
                        }
                    })
            }
        }
    }
})