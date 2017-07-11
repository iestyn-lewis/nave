Nave.registerLayouts("gallery", function() {
    var lb = Nave.layouts("nvBase");
    return {
        nvLayoutDisplay : function(obj) {
            var id = obj.id;
            var name = obj.name;
            var params = obj.params;
            var example = obj.example;
            example.id = id + "-example";
            var ret = {
                    id: id + "-content",
                    layout: lb.nvPanel,
                    header: name,
                    headerSize: 3,
                    content: {
                        layout: lb.nvColumns,
                        widths: [6,6],
                        columns: [
                            example,
                            {
                                id: id + "-params",
                                layout: lb.nvList,
                                header: "Params:",
                                list: params
                            } 
                        ]
                    }
            };
            return Nave.renderObject(ret);
        }
    }
})