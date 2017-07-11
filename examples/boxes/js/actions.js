Nave.registerActions('boxes', function(state, update) {
    var newDrawing = {
        name: 'New Drawing',
        numRows: 1,
        numColumns: 2,
        boxes: []
    };
    var newBox = {
        type: 'box',
        header: 'New Box',
        text: "",
        row: 0,
        column: 0,
        arrows: {bottom: 0, side: 0, diag: 0}
    };
    var boxIndex = function(boxid) {
        return Nave.indexOf(state.drawings[state.currDrawing].boxes, function(box) {
            return box.id == boxid;
        });
    };
    return {
        addDrawing: function() {
            state.drawings.push(newDrawing);
            state.currDrawing = state.drawings.length - 1;
            update(state);
        },
        removeDrawing: function() {
            state.drawings.splice(state.currDrawing, 1);
            state.currDrawing = 0;
            update(state);
        },
        setCurrDrawing: function(index) {
            state.currDrawing = index;
            update(state);
        },
        toggleMode: function() {
            var mode = state.mode || 'run';
            state.mode = mode == 'run' ? 'edit' : 'run';
            update(state);
        },
        setDrawingName: function(name) {
            state.drawings[state.currDrawing].name = name;
            update(state);
        },
        setNumRows: function(numRows) {
            state.drawings[state.currDrawing].numRows = numRows;
            update(state);
        },
        setNumColumns: function(numColumns) {
            state.drawings[state.currDrawing].numColumns = numColumns;
            update(state);
        },
        addBox: function(row, column) {
            var b = Nave.copy(newBox);
            b.id = Nave.guid();
            b.row = row;
            b.column = column;
            state.drawings[state.currDrawing].boxes = state.drawings[state.currDrawing].boxes || [];
            state.drawings[state.currDrawing].boxes.push(b);
            update(state);
        },
        removeBox: function(boxid) {
            var index = boxIndex(boxid);
            state.drawings[state.currDrawing].boxes.splice(index, 1);
            update(state);
        },
        setBoxHeader: function(boxid, header) {
            state.drawings[state.currDrawing].boxes[boxIndex(boxid)].header = header;
            update(state);
        },
        setBoxText: function(boxid, text) {
            state.drawings[state.currDrawing].boxes[boxIndex(boxid)].text = text;
            update(state);            
        },
        setArrow: function(boxid, direction,index) {
            state.drawings[state.currDrawing].boxes[boxIndex(boxid)].arrows[direction] = index;
            update(state);
        }
    }
})

Nave.registerListener('localStorage', function(state) {
    Nave.services('local').save('boxes_state', state);
})
