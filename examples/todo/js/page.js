// We only have one page in our application.  Pages are meant
// to separate parts of your application with very different 
// functionality.  This app only does one thing, so we only
// need one page.
// Adrianna Dew
// 482786

Nave.registerPage('todo', function(state) {
    // We pulled in the Nave base layouts library,
    // and we have some custom layouts too
    var lb = Nave.layouts('nvBase');
    var lt = Nave.layouts('todo');
    return {
        id: 'todoApp',
        layout: lb.nvForm,
        title: "ToDo With Nave",
        form: [
            {
                id: 'add',
                layout: lb.nvInput,
                label: "New Item",
                value: "",
                action: "Nave.actions('todo').addItem(this.value); this.value='';",
                onFocus: "Nave.actions('todo').cancelEdit()"
            },
            {
                id: 'existing',
                layout: lb.nvTable,
                trigger: "todos.length",
                headers: ["ToDo List", ""],
                rows: Nave.map(state.todos, function(item, index) { 
                    return {
                        id: 'item_' + index,
                        layout: lb.nvTableRow,
                        trigger: "editItemIndex",
                        cols: [
                            {
                                id: 'colItem_' + index,
                                layout: lb.nvForm,
                                form: [
                                    {
                                        id: 'colItemDisp_' + index,
                                        layout: lb.nvLink,
                                        visible: state.editItemIndex != index,
                                        text: item,
                                        onclick: "Nave.actions('todo').setEditItem(" + index + ")"
                                    },
                                    {
                                        id: 'colItemEdit_' + index,
                                        layout: lb.nvInput,
                                        visible: state.editItemIndex == index,
                                        value: item,
                                        action: "Nave.actions('todo').editItem(" + index + ", this.value)",
                                        cancel: "Nave.actions('todo').cancelEdit()",
                                        focusOnCreate: true,
                                        cursorToEndOnFocus: true
                                    }
                                ]                                
                            },
                            {
                                id: 'colDelete_' + index,
                                layout: lb.nvButton,
                                classname: "btn btn-xs btn-danger",
                                text: "X",
                                onclick: "Nave.actions('todo').deleteItem(" + index + ")"
                            }
                        ]
                    }
                })               
            }
        ]
    }
})