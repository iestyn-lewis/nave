// Base Layouts

Nave.registerLayouts("nvBase", function() {
    return {
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
        nvLabel : function(obj) {
            var text = obj.text || "";
            return `<label>${text}</text>`;
        },
        nvSpacer : function(obj) {
            return '<p></p>';
        },
        nvParagraph : function(obj) {
            var text = obj.text;
            var headerText = "";
            if (obj.header) {
                headerText = `<label>${obj.header}</label>`;
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
            var ret = Nave.reduce(form, function(item) {
                return Nave.renderObject(item, element, margin);
            })
            if (obj.title) {
                ret = `<label>${obj.title}</label>` + ret;
            }
            return ret;
        },
        nvInput : function(obj) {
            var label = obj.label || "";
            var value = obj.value;
            var action = obj.action;
            var cancel = obj.cancel;
            var update = obj.update;
            var event = obj.event || "onchange";
            var numeric = obj.numeric || false;
            var password = obj.password || false;
            var inputType = password ? "password" : "text";
            var focusOnCreate = obj.focusOnCreate || false;
            var selectTextOnFocus = obj.selectTextOnFocus || false;
            var cursorToEndOnFocus = obj.cursorToEndOnFocus || false;
            var onFocus = obj.onFocus || "";
            var focusOnCreateTag = "";
            if (focusOnCreate) {focusOnCreateTag = 'nv-focus="true"';}
            var selectTextOnFocusTag = "";
            if (selectTextOnFocus) {selectTextOnFocusTag = 'onfocus="this.select()"';}
            var cursorToEndOnFocusTag = "";
            if (cursorToEndOnFocus) {cursorToEndOnFocusTag = `onfocus="this.selectionStart = this.selectionEnd = this.value.length;"`}
            var onFocusTag = "";
            if (onFocus != "") {onFocusTag = `onfocus="${onFocus}"`}
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
                var numericTag = numeric ? "true" : "false";
                eventTag = `${event}="Nave.updateStateValue('${update}', this.value, ${numericTag})"`
            }
            return `<div ${formGroupTag}>${labelTag}
                        <input class="form-control" type="${inputType}" 
                        value="${value}" 
                        ${eventTag}
                        ${selectTextOnFocusTag}
                        ${cursorToEndOnFocusTag}
                        ${focusOnCreateTag}
                        ${onFocusTag}
                         />
                    </div>`;            
        },
        nvTextArea : function(obj) {
            var event = obj.event || "onchange";
            var label = obj.label || "";
            var value = obj.value;
            var action = obj.action;
            var update = obj.update;
            var rows = obj.rows || 2;
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
                        <textarea class="form-control" ${eventTag} rows="${rows}">${value}</textarea>
                    </div>`;            
              
        },
        nvSelect : function(obj) {
            // label, onchange, options
            var keyParam = obj.keyParam;
            var valueParam = obj.valueParam;
            var emptyOption = obj.emptyOption || "";
            var emptyValue = obj.emptyValue || "";
            var selectedCompare = obj.selectedCompare;
            var extraOptions = obj.extraOptions;
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
                emptyTag = `<option value="${emptyValue}">${emptyOption}</option>`;
            }
            var extraOptionsTag = "";
            if (extraOptions) {
                extraOptionsTag = Nave.reduce(extraOptions, function(option) {
                    return `<option value="${option.value}">${option.display}</option>`;
                })
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
                            ${extraOptionsTag}
                            ${options}
                        </select>
                    </div>`            
        },
        nvCheckbox : function(obj) {
            var onchange = obj.onchange;
            var update = obj.update;
            var label = obj.label || "";  
            var labelTag = "";
            var checked = (obj.checked && obj.checked != "false") ? "checked" : "";
            if (label != "") {
                labelTag = `<label>${label}</label>`;
                formGroupTag = "class='form-group'";
            }
            var eventTag = "";
            if (onchange) {
                eventTag = `onchange="${onchange}"`
            } else if (update) {
                eventTag = `onchange="Nave.updateStateValue('${update}', this.checked, true)"`
            }
            return `<div ${formGroupTag}>${labelTag}
                        <input class="form-control" type="checkbox" 
                        ${checked}
                        ${eventTag}
                         />
                    </div>`;
        },
        nvFile : function(obj) {
            var onchange = obj.onchange || "";
            var label = obj.label || "";
            var labelTag = "";
            if (label != "") {
                labelTag = `<label>${label}</label>`;
                formGroupTag = "class='form-group'";
            }
            return `<div ${formGroupTag}>${labelTag}
                        <input class="form-control" type="file" 
                        onclick="this.value=null;"
                        onchange="${onchange}"
                         />
                    </div>`
        },
        nvTabs : function(obj) {
            var tabs = obj.tabs;
            var activeTab = obj.activeTab;
             // activeTab
            // tabs - each an object with caption, component
            var navItems = Nave.reduce(tabs, function(tab) {
                var active = tab.id == activeTab ? "active" : "";
                return `<li role="presentation" class="${active}">
                            <a href="#${tab.id}_tab" role="tab" data-toggle="tab">${tab.caption}</a>
                        </li>`;  
            })
            var tabItems = Nave.reduce(tabs, function(tab) {
                var active = tab.id == activeTab ? "active" : "";
                return `<div role="tabpanel" class="tab-pane fade ${active} in" id="${tab.id}_tab">
                            <div class="col-xs-12">
                                <p>
                                ${Nave.renderObject(tab)}
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
        nvPages : function(obj) {
            // switch pages in response to clicking
            var pages = obj.pages;
            var activePage = obj.activePage;
            var nav = Nave.reduce(pages, function(page, key) {
                var active = key == activePage;
                var link = "";
                var activeText = "";
                if (active) {
                    activeText = 'class="active"'
                } 
                link = `<a href="#" onclick="Nave.actions('nvBase').setPage('${key}'); return false;">${page.name}</a>`;
                return `<li ${activeText}>${link}</li>`;
            })  
            return `<nav><ul class="pagination">${nav}</ul></nav>`;
        },
        nvColumns : function(obj) {
            var columns = obj.columns;
            var columnText = Nave.reduce(columns, function(column, key) {
                var header = column.colHeader || "";
                var headerText = "";
                var width = column.colWidth || column.width;
                if (header != "") {
                    headerText = `<label>${header}</label>`;
                }
                return `<div class="col-xs-${width}">
                            ${headerText}
                            ${Nave.renderObject(column)}
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
            var header = obj.header || obj.label || "";
            var list = obj.list;
            var valueParam = obj.valueParam;
            var headerText = "";
            if (header != "") {
                headerText = `<label>${header}</label>`;
            }
            return `${headerText}
                    <ul>    
                        ${Nave.reduce(list, function(item, index) {
                            if (valueParam) {
                                item = item[valueParam];
                            }
                            return `<li>${item}</li>`; 
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
                                return `${Nave.renderObject(row, 'tr')}`;
                            })}
                        </tbody>
                       </table>`
             return ret;
        },
        nvTableRow : function(obj) {
            var cols = obj.cols;
            return Nave.reduce(cols, function(col, index) {
                return `<td>${Nave.renderObject(col)}</td>`;
            })
        },
        nvWait : function(obj) {
            var message = obj.message || "Please wait...";
            return `<div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(255,255,255,.9);
                        text-align: center;
                        line-height: 100px;
                    "><label>${message}</label></div>`
        }
    }
})


