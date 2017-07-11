// We only have one page in our application.  Pages are meant
// to separate parts of your application with very different 
// functionality.  This app only does one thing, so we only
// need one page.

Nave.registerPage('todo', function(state) {
    // Use the Nave BaseLayout library
    // Alias it to lb for ease of use in the following.
    var lb = Nave.layouts('nvBase');
    // Construct the page as a simple javascript object
    // Each node in the object must have an id, and a layout
    return {
        // this is the top level node
        id: 'todoApp',
        // the layout is nvForm, which takes one argument - an array of sub-nodes
        // these sub-nodes will be rendered vertically
        layout: lb.nvForm,
        form: [
            // header node, simply text rendered in an <h> tag
            {
                id: 'header',
                layout: lb.nvHeader,
                text: "ToDo With Nave"
            },
            {
                // New item node, rendered as an input textbox
                id: 'add',
                layout: lb.nvInput,
                label: "New Item",
                value: "",
                // Specify the action to take when the text changes
                action: "Nave.actions('todo').addItem(this.value); this.value='';",
                onFocus: "Nave.actions('todo').cancelEdit()"
            },
            {
                // Existing items node, rendered as a table.
                // Each entry in the table can be clicked, allowing editing in place 
                id: 'existing',
                layout: lb.nvTable,
                // the trigger is the element of state which, when changed, triggers a re-render of this node
                // to keep things simple, we'll say that anytime the length of the todo list changes, we need to rerender
                trigger: "todos.length",
                headers: ["ToDo List", ""],
                // The rows can be generated using the Nave map function, which
                // iterates over the state.todos list and returns a node for each one
                rows: Nave.map(state.todos, function(item, index) { 
                    return {
                        // each row represents one todo item
                        // using the nvTableRow layout
                        id: 'item_' + index,
                        layout: lb.nvTableRow,
                        // we rerender when the editItemIndex (representing the item currently being edited) changes
                        trigger: "editItemIndex",
                        // the nvTableRow layout expects a cols object, representing an array of layouts, one for each column
                        cols: [
                            {
                                // the first column is the item text, and is handled by a form layout
                                id: 'colItem_' + index,
                                layout: lb.nvForm,
                                // the form has 2 elements, only one of which is visible at a time
                                form: [
                                    {
                                        // this element is a link, shown when the element is not being edited
                                        id: 'colItemDisp_' + index,
                                        layout: lb.nvLink,
                                        // visible when the current edit item is not this item
                                        visible: state.editItemIndex != index,
                                        text: item,
                                        // when clicked, 
                                        onclick: "Nave.actions('todo').setEditItem(" + index + ")"
                                    },
                                    {
                                        // this element is a textbox, shown when the element is being edited
                                        id: 'colItemEdit_' + index,
                                        layout: lb.nvInput,
                                        visible: state.editItemIndex == index,
                                        value: item,
                                        action: "Nave.actions('todo').editItem(" + index + ", this.value)",
                                        cancel: "Nave.actions('todo').cancelEdit()",
                                        // these will focus the textbox when it is created, and put the cursor at the end of the text
                                        focusOnCreate: true,
                                        cursorToEndOnFocus: true
                                    }
                                ]                                
                            },
                            {
                                // the second column is the delete button for the item
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