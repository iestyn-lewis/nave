Nave.registerLayouts("nvEdit", function() {
    var lb = Nave.layouts("nvBase");
    return {
        neEditToggle : function(obj) {
            var mode = obj.mode || 'run';
            var text = mode == 'run' ? 'Edit' : 'Run';
            var color = mode == 'run' ? 'blue' : 'green';
            var ret = {
                layout: lb.nvButton,
                action: obj.action,
                text: text,
                color: color
            }
            return Nave.renderObject(ret, 'none');
        },
        neHeader : function(obj) {
            var mode = obj.mode || 'run';
            var size = obj.size || 3;
            var ret = {};
            if (mode == 'run') {
                ret = {
                    layout: lb.nvHeader,
                    text: obj.value,
                    size: obj.size
                }
            } else {
                ret = {
                    layout: lb.nvInput,
                    label: obj.label,
                    value: obj.value,
                    action: obj.action
                }
            }
            return Nave.renderObject(ret, 'none');
        },
        neParagraph : function(obj) {
            var mode = obj.mode || 'run';
            var rows = obj.rows || 2;
            var ret = {};
            if (mode == 'run') {
                ret = {
                    layout: lb.nvParagraph,
                    text: obj.value
                }
            } else {
                ret = {
                    layout: lb.nvTextArea,
                    rows: rows,
                    label: obj.label,
                    value: obj.value,
                    action: obj.action
                }
            }
            return Nave.renderObject(ret, 'none');            
        }
    }
})

Nave.registerLayouts("arrows", function() {
    var lb = Nave.layouts("nvBase");
    return {
        arrow : function(obj) {
            var mode = obj.mode || 'run';
            var boxid = obj.boxid;
            var direction = obj.direction;
            var selIndex = obj.selIndex;
            var typeMap = {bottom: 0, side: 1, diag: 2};
            var directionMap = [0, 1, 2];
            var options = [["X", "U", "D", "UD"],
                           ["X", "R", "L", "RL"],
                           ["X", "DR", "UL", "DR-UL", "DL", "UR", "DL-UR"]];
            var faimg = [["", "arrow-up", "arrow-down", "arrows-v"],
                         ["", "arrow-right", "arrow-left", "arrows-h"],
                         ["", "arrow-right", "arrow-left", "arrows-h", "arrow-down", "arrow-up", "arrows-v"]];
            var pushdown = [0,2,0];
            var classname = ["","","rotate-45-right"];
            var dirIndex = typeMap[direction];
            var ret = {
                html: '<h1>&nbsp;</h1>'
            }
            if (selIndex != 0) {
                ret = {
                    layout: lb.nvFA,
                    magnify: 3,
                    classname: classname[dirIndex],
                    image: faimg[dirIndex][selIndex],
                    pushdown: pushdown[dirIndex],
                    center: true
                }
            }
            if (mode == "edit") {
                ret = {
                    layout: lb.nvSelect,
                    values: options[directionMap[dirIndex]],
                    selectedCompare: selIndex,
                    action: `Nave.actions('boxes').setArrow('${boxid}','${direction}', this.value)`
                }
            }
            return Nave.renderObject(ret, 'none');
        }
    }
})

Nave.registerLayouts("box", function() {
    var lb = Nave.layouts("nvBase");
    var le = Nave.layouts("nvEdit");
    var ar = Nave.layouts("arrows");
    return {
        box : function(obj) {
            var id = obj.id;
            var box = obj.box;
            var header = box.header || '&nbsp;';
            var text = box.text || '&nbsp;';
            var arrows = box.arrows;
            var mode = obj.mode || 'read';
            var content = {
                layout: le.neParagraph,
                mode: mode,
                value: text,
                rows: 8,
                action: `Nave.actions('boxes').setBoxText('${id}', this.value)`
            }
            var headerLayout = {
                layout: lb.nvColumns,
                widths: [10,2],
                columns: [
                    {
                        layout: le.neHeader,
                        size: 3,
                        mode: mode,
                        value: header,
                        action: `Nave.actions('boxes').setBoxHeader('${id}', this.value)`
                    },
                    {
                        layout: lb.nvButton,
                        visible: mode == 'edit',
                        color: 'red',
                        text: 'X',
                        action: `Nave.actions('boxes').removeBox('${id}')`
                    }
                ]
            }           
            var headerText = `<div class="panel-heading">${Nave.renderObject(headerLayout, 'none')}</div>`;
            var panel = `<div class="panel panel-default  fixed-panel">
                      ${headerText}
                      <div class="panel-body">
                        ${Nave.renderObject(content, 'none')}
                      </div>
                    </div>`;
            var ret = {
                layout: lb.nvForm,
                form: [
                    {
                        layout: lb.nvColumns,
                        widths: [10,2],
                        colclassname: 'vcenter',
                        columns: [
                            {
                                html: panel
                            },
                            {
                               layout: ar.arrow,
                               boxid: id,
                               mode: mode,
                               direction: "side",
                               selIndex: box.arrows["side"]
                            },
                        ]
                    },
                    {
                        layout: lb.nvColumns,
                        widths: [10,2],
                        columns: [
                            {
                               layout: ar.arrow,
                               boxid: id,
                               mode: mode,
                               direction: "bottom",
                               selIndex: box.arrows["bottom"]
                            },
                            {
                               layout: ar.arrow,
                               boxid: id,
                               mode: mode,
                               direction: "diag",
                               selIndex: box.arrows["diag"]
                            },
                        ]
                    }                 
                ]
            }
            return Nave.renderObject(ret, 'none');
        },
    }
})

Nave.registerLayouts("boxes", function() {
    var lb = Nave.layouts("nvBase");
    var bx = Nave.layouts("box");
    return {
        display : function(obj) {
            var cols = obj.cols;
            var rows = obj.rows;
            var boxes = obj.boxes;
            var mode = obj.mode || 'run';
            var rowArray = [];
            // intialize grid
            for (var j=0; j<rows; j++) {
                rowArray.push([]);
                var colArray = rowArray[j];
                for(var i=0; i<cols; i++) {
                    colArray.push(i);
                }
            }
            var width = 12 / cols;
            var widths = Nave.map(rowArray[0], function(item) {
                return width;
            });
            var rowContent = Nave.map(rowArray, function(colArray, rowIndex) {
                var colContent = Nave.map(colArray, function(colIndex) {
                    var box = Nave.filter(boxes, function(box) {
                        return box.row == rowIndex && box.column == colIndex;
                    })
                    if (box.length < 1) {
                        return {
                            id: "btn-add-box-" + rowIndex + "-" + colIndex,
                            layout: lb.nvButton,
                            visible: mode == 'edit',
                            color: 'green',
                            text: '+',
                            action: `Nave.actions('boxes').addBox(${rowIndex}, ${colIndex})`
                        }
                    } else {
                        box = box[0];
                        return {
                            id: box.id,
                            layout: bx.box,
                            mode: mode,
                            box: box                            
                        }
                    }
                });
                return {
                    id: 'display-row-' + rowIndex,
                    layout: lb.nvColumns,
                    widths: widths,
                    columns: colContent
                }
            })
            var ret = {
                layout: lb.nvForm,
                form: rowContent
            }
            return Nave.renderObject(ret, 'none');
        }
    }
})