Nave.registerPage('boxes', function(state) {
    var lb = Nave.layouts('nvBase');
    var le = Nave.layouts('nvEdit');
    var bx = Nave.layouts('boxes');
    var currDrawing = state.drawings[state.currDrawing];
    return {
        id: "boxes",
        layout: lb.nvForm,
        form: [
            {
                id: "header",
                layout: lb.nvHeader,
                size: 3,
                text: "Drawings"
            },
            {
                id: "selDrawingGroup",
                layout: lb.nvColumns,
                widths: [10,2],
                columns: [
                    {
                        id: "selDrawing",
                        layout: lb.nvSelect,
                        trigger: "drawings",
                        selectedCompare: state.currDrawing,
                        values: state.drawings,
                        valueParam: 'name',
                        action: "Nave.actions('boxes').setCurrDrawing(this.value)"
                    },
                    {
                        id: "buttons",
                        layout: lb.nvForm,
                        horizontal: true,
                        form: [
                            {
                                id: "btnAdd",
                                layout: lb.nvButton,
                                text: "+",
                                color: "green",
                                action: "Nave.actions('boxes').addDrawing()"
                            },
                            {
                                id: "btnRem",
                                layout: lb.nvButton,
                                text: "-",
                                color: "red",
                                action: "Nave.actions('boxes').removeDrawing()"
                            }                
                        ]
                    }
                ]
            },
            {
                id: "spacer1",
                layout: lb.nvSpacer
            },
            {
                id: 'modebutton',
                layout: le.neEditToggle,
                mode: state.mode,
                trigger: 'mode',
                action: "Nave.actions('boxes').toggleMode()"
            },
            {
                id: "spacer2",
                layout: lb.nvSpacer
            },            
            {
                id: "inDrawingName",
                layout: le.neHeader,
                size: 2,
                mode: state.mode,
                label: "Name",
                trigger: "*",
                value: currDrawing.name,
                action: "Nave.actions('boxes').setDrawingName(this.value)"
            },
            {
                id: "inNumRows",
                layout: lb.nvInput,
                visible: state.mode == 'edit',
                label: "# Rows",
                trigger: "currDrawing",
                value: currDrawing.numRows,
                action: "Nave.actions('boxes').setNumRows(this.value)"
            },
            {
                id: "inNumColumns",
                layout: lb.nvInput,
                visible: state.mode == 'edit',
                label: "# Columns",
                trigger: "currDrawing",
                value: currDrawing.numColumns,
                action: "Nave.actions('boxes').setNumColumns(this.value)"
            },
            {
                id: "display",
                trigger: "*",
                layout: bx.display,
                mode: state.mode,
                rows: currDrawing.numRows,
                cols: currDrawing.numColumns,
                boxes: currDrawing.boxes || []
            }
        ]
    }
})