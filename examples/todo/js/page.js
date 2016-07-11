// We only have one page in our application.  Pages are meant
// to separate parts of your application with very different 
// functionality.  This app only does one thing, so we only
// need one page.

Nave.registerPage('todo', function(state) {
    // We pulled in the Nave base layouts library,
    // and we have some custom layouts too
    var lb = Nave.layouts('nvBase');
    var lt = Nave.layouts('todo');
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
                    function(item, index) { return {
                        layout: lb.nvTableRow,
                        trigger: "editItemIndex",
                        cols: {
                            colItem: {
                                layout: lt.editableText,
                                value: item,
                                mode: state.editItemIndex == index ? "edit" : "text",
                                text_action: "Nave.actions('todo').setEditItem(" + index + ")",
                                edit_action: "Nave.actions('todo').editItem(" + index + ", this.value)"
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