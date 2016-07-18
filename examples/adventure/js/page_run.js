Nave.registerPage('run', function(state) {
    var lb = Nave.layouts('nvBase');
    var currentRoom = state.rooms[state.currentRoom];
    var conditionalText = "";
    var inventory = state.inventory;
    var condText = Nave.actions('condText');
    var action = Nave.actions('actionFn');
    var actions = action.current();
    return {
        id: "adventureApp",
        layout: lb.nvForm,
        trigger: "*",
        form: [
            {
                id: "title",
                layout: lb.nvHeader,
                size: 1,
                text: "Nave Adventure Game"
            },
            {
                id: "room",
                layout: lb.nvHeader,
                size: 2,
                text: currentRoom.title
            },
            {
                id: "text",
                layout: lb.nvParagraph,
                text: currentRoom.text
            },
            {
                id: "conditionalText",
                layout: lb.nvParagraph,
                text: condText.current()
            },
            {
                id: "items",
                layout: lb.nvForm,
                form: Nave.mapObjToArr(currentRoom.items, function(item, key) {
                    return {
                        id: key,
                        layout: lb.nvParagraph,
                        text: item.location
                    }
                })  
            },
            {
                id: "inventory",
                layout: lb.nvList,
                header: Nave.empty(state.inventory) ? "" : "You are carrying:",
                list: state.inventory,
                valueParam: 'name'
            },
            {
                id: "actions",
                layout: lb.nvSelect,
                values: actions,
                visible: !currentRoom.hideActions,
                keyParam: 'key',
                valueParam: 'caption',
                emptyOption: "Select an action",
                action: "Nave.actions('room').doAction(this.value)"
            }
        ]
    }    
});