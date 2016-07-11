// Base Layouts

Nave.registerLayouts("nvBase", 
    {
        nvLink : function(obj) { 
            var onclick = obj.onclick;
            var href = obj.href;
            var text = obj.text;
            var onclick_text = ""
            var href_text = "#"
            if (onclick) {
                onclick_text = `onclick="${onclick}; return false;"`;
            }
            if (href) {
                href_text = href;
            }
            return `<a href="${href_text}" ${onclick_text}>${text}</a>`;
        },
        nvHeader : function(obj) {
            var size = obj.size || 3;
            var text = obj.text;
            return `<h${size}>${text}</h${size}>`;
        },
        nvParagraph : function(obj) {
            var text = obj.text;
            var headerText = "";
            if (obj.header) {
                headerText = `<h4>${obj.header}</h4>`;
            }
            return `${headerText}<p>${text}</p>`;
        },
        nvButton : function(obj) {
            var classname = obj.classname;
            var onclick = obj.onclick
            var text = obj.text;
            return `<button class="${classname}"
                            onclick="${onclick}">
                        ${text}
                    </button>`;        
        },
        nvForm : function(obj) {
            var form = obj.form;
            var horizontal = obj.horizontal || false;
            var element = horizontal ? "span" : "div";
            var margin = horizontal ? "margin-right: 10px;" : null;
            var ret = Nave.reduce(form, function(item, key) {
                return Nave.renderObject(item, key, element, margin);
            })
            if (obj.title) {
                ret = `<h3>${obj.title}</h3>` + ret;
            }
            return ret;
        },
        nvInput : function(obj) {
            var label = obj.label || "";
            var value = obj.value;
            var action = obj.action;
            var update = obj.update;
            var event = obj.event || "onchange";
            var numeric = obj.numeric || false;
            var password = obj.password || false;
            var inputType = password ? "password" : "text";
            var labelTag = "";
            var formGroupTag = "";
            if (label != "") {
                labelTag = `<label>${label}</label>`;
                formGroupTag = "class='form-group'";
            }
            var eventTag = "";
            if (action) {
                eventTag = `${event}="${action}"`
            } else if (update) {
                eventTag = `${event}="Nave.updateStateValue('${update}', this.value, false)"`
            }
            return `<div ${formGroupTag}>${labelTag}
                        <input class="form-control" type="${inputType}" 
                        value="${value}" 
                        ${eventTag} />
                    </div>`;            
        },
        nvTextArea : function(obj) {
            var event = obj.event || "onchange";
            var label = obj.label || "";
            var value = obj.value;
            var action = obj.action;
            var update = obj.update;
            var labelTag = "";
            if (label != "") {
                labelTag = `<label>${label}</label>`;
            }
            var eventTag = "";
            if (action) {
                eventTag = `${event}="${action}"`
            } else if (update) {
                eventTag = `${event}="Nave.updateStateValue('${update}', this.value, false)"`
            }
            return `<div class="form-group">${labelTag}
                        <textarea class="form-control" ${eventTag}>${value}</textarea>
                    </div>`;            
              
        },
        nvSelect : function(obj) {
            // label, onchange, options
            var keyParam = obj.keyParam;
            var valueParam = obj.valueParam;
            var emptyOption = obj.emptyOption || "";
            var selectedCompare = obj.selectedCompare;
            var values = obj.values;
            var event = obj.event || "onchange";
            var action = obj.action;
            var update = obj.update;
            var label = obj.label || "";
            var size = obj.size || 1;
            var labelTag = "";
            if (label != "") {
                labelTag = `<label>${label}</label>`;
            }
            var eventTag = "";
            if (action) {
                eventTag = `${event}="${action}"`
            } else if (update) {
                eventTag = `${event}="Nave.updateStateValue('${update}', this.value, false)"`
            }
            var emptyTag = "";
            if (emptyOption) {
                emptyTag = `<option value="">${emptyOption}</option>`;
            }
            var options = ""
            if (values) {
                options = Nave.reduce(values, function(option, key) {
                    var option = values[key];
                    var value = key;
                    if (keyParam != 'key') {
                        value = option[keyParam]
                    }
                    var caption = option[valueParam];
                    var selected = "";
                    if (selectedCompare) {
                        selected = selectedCompare == value ? "selected" : "";                
                    }
                    return `<option value="${value}" ${selected}>${caption}</option>`; 
                });                
            }
            return  `<div class="form-group">${labelTag}
                        <select class="form-control" size="${size}" ${eventTag}>
                            ${emptyTag}
                            ${options}
                        </select>
                    </div>`            
        },
        nvTabs : function(obj) {
            var tabs = obj.tabs;
            var activeTab = obj.activeTab;
             // activeTab
            // tabs - each an object with caption, component
            var navItems = Nave.reduce(tabs, function(tab, key) {
                var active = key == activeTab ? "active" : "";
                return `<li role="presentation" class="${active}">
                            <a href="#${key}_tab" role="tab" data-toggle="tab">${tab.caption}</a>
                        </li>`;  
            })
            var tabItems = Nave.reduce(tabs, function(tab, key) {
                var active = key == activeTab ? "active" : "";
                return `<div role="tabpanel" class="tab-pane fade ${active} in" id="${key}_tab">
                            <div class="col-xs-12">
                                <p>
                                ${Nave.renderObject(tab,key)}
                            </div>
                        </div>`;
            })
            return `<ul class="nav nav-tabs" role="tablist">
                        ${navItems}
                    </ul>
                    <div class="tab-content">
                        ${tabItems}
                    </div>`;
        },
        nvColumns : function(obj) {
            var columns = obj.columns;
            var columnText = Nave.reduce(columns, function(column, key) {
                var header = column.header || "";
                var headerText = "";
                if (header != "") {
                    headerText = `<h3>${header}</h3>`;
                }
                return `<div class="col-xs-${column.width}">
                            ${headerText}
                            ${Nave.renderObject(column, key)}
                        </div>`;
            })
            var ret = `<div class="row">
                            ${columnText}
                       </div>`;
            if (obj.title) {
                ret = `<h3>${obj.title}</h3>` + ret;
            }
            return ret;
        },
        nvList : function(obj) {
            var header = obj.header || "";
            var list = obj.list;
            var headerText = "";
            if (header != "") {
                headerText = `<h4>${header}</h4>`;
            }
            return `${headerText}
                    <ul>
                        ${Nave.reduce(list, function(street, streetIndex) {
                                return `<li>${street}</li>`; 
                         })}
                    </ul>`
        },
        nvTable : function(obj) {
            var headers = obj.headers;
            var rows = obj.rows;
            var ret = `<table class="table table-condensed table-striped">
                        <thead>
                            <tr>
                                ${Nave.reduce(headers, function(header, index) {
                                    return `<th>${header}</th>`;  
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            ${Nave.reduce(rows, function(row, index) {
                                return `${Nave.renderObject(row, index, 'tr')}`;
                            })}
                        </tbody>
                       </table>`
             return ret;
        },
        nvTableRow : function(obj) {
            var cols = obj.cols;
            return Nave.reduce(cols, function(col, index) {
                return `<td>${Nave.renderObject(col, index)}</td>`;
            })
        }
    }
)


