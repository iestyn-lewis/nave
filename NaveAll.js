var Nave = (function() {
    var appName = "NaveApp";
    var history = [];
    var state;
    var m_layouts = {};
    var m_actions = {};
    var m_services = {};
    var listeners = {};
    var pages = {};
    return {                 
        
        // Nave will look for a div with the classname you set here,
        // and try to render components that match div classnames below
        // Default is "NaveApp"
        
        setAppName : function(name) {
            appName = name;  
        },
        registerPage : function(pageId, page) {
            pages[pageId] = page;
        },
        setPage : function(inPage) {
            page = inPage;
        },
        renderPage : function(pageId) {
            var newPage = false;
            var oldState = history[history.length - 1];
            if (oldState) { 
                newPage = oldState.nave.page != state.nave.page; 
            }
            var p = pages[pageId](state);
            var targetDiv = $('.' + appName);
            var ret = Nave.renderObject(p);
            if (targetDiv.html().trim() == "" || newPage) {
                targetDiv.html(ret);  
            }
            // focus elements that are set to focus themselves
            $("[nv-focus='true']").focus();
        },
        renderObject : function(item, element, style) {
            // construct html string 
            element = element || "div";
            style = style || "";
            var key = item.id;
            var id = "";
            if (key) {
                id = 'id="' + key + '"';                
            }
            var visible = true;
            if ("visible" in item) {
                visible = item.visible;
            }
            var nvHide = "";
            if (!visible) { 
                style += "display:none;"
                nvHide = 'nv-hidden="true"'; 
            }
            if (style != "") {
                style = 'style="' + style + '"';
            }
            var ret = "";
            if (visible) {
                if (item.layout) {
                    ret += item.layout(item);
                } else if (item.html) {
                    ret += item.html;
                }                
            }
            // push html into dom 
            if (key) {
                var targetDiv = $('#' + key);
                if (targetDiv.length == 0 || targetDiv.parents("[nv-hidden='true']").length > 0) {
                    visible = false;
                }
                if (visible) {
                    var reRender = false;
                    if (item.trigger) {
                        if (item.trigger == "*") {
                            reRender = true;
                        } else {
                            reRender = Nave.checkReRender(item.trigger);                
                        }
                    }
                    // if the component has just become visible, over-ride and render
                    if (targetDiv.attr('nv-hidden') == 'true') {
                        reRender = true;
                    }
                    if (reRender) {
                        targetDiv.html(ret);
                    }
                    targetDiv.attr('nv-hidden', "false");
                    targetDiv.show();
                } else {
                    targetDiv.attr("nv-hidden", "true");
                    targetDiv.hide();
                }
            }
            // return html string
            ret = '<' + element + ' ' + id + ' ' + nvHide + ' ' + style + '>' + ret + '</' + element + '>';
            return ret;              
        },
        checkReRender : function(path) {
            var oldState = history[history.length - 1];
            if (!oldState) { return true; } 
            var oldProps = "";
            var props = "";
            if (path instanceof Array) {
                var oldPropsArr = Nave.map(path, function(item) {
                    return "oldState." + item;
                })
                oldProps = oldPropsArr.join(" + ");
                var propsArr = Nave.map(path, function(item) {
                    return "state." + item;
                })
                props = propsArr.join(" + "); 
            } else {
                oldProps = eval('oldState.' + path);
                props = eval('state.' + path);                
            }
            return !(JSON.stringify(oldProps) === JSON.stringify(props));
        },
        
        // LAYOUTS - template html that can be parameterized
        // at design time - not at runtime
        registerLayouts : function(layoutId, layout) {
            m_layouts[layoutId] = layout;
        },
        layouts : function(layoutId) {
            return m_layouts[layoutId];
        },
        
        // ACTIONS - take action on state
        // Actions are functions that take the current state as an argument.
        // If action is taken on the state, return the state.  If no action should be taken,
        // return null
        
        registerActions : function(actionId, action) {
            m_actions[actionId] = action;
        },
        actions : function(actionId) {
            var action = m_actions[actionId];
            var state = Nave.getState();
            return action(state, Nave.setState);  
        },
        
        // SERVICES
        registerService : function(serviceId, service) {
            m_services[serviceId] = service;
        },
        services : function(serviceId) {
            return m_services[serviceId];
        },
        
        // LISTENERS
        // Listeners are called after a new state is set
        // They are listen-only, in that any changes they make
        // to state will be disregarded.
        registerListener : function(listenerId, listener) {
            listeners[listenerId] = listener;
        },
        
        // getState returns a copy of the current state                
        getState : function() {
            return JSON.parse(JSON.stringify(state));
        },
        // Calling setState triggers a re-render.  
        setState : function(newState) {
            history.push(state);
            state = newState;
            console.log("State", state);
            Nave.renderPage(state.nave.page);
            Nave.each(listeners, function(listener) {
                listener(state);
            })
            return Nave.getState();
        },
        // Internal state helper functions - these should not be used externally
        getHistory : function() {
            return history;
        },
        // element helpers     
        getStateValue : function(expression) {
            return eval('state.' + expression);
        },  
        updateStateValue : function(expression, newValue, asNumber) {
            var state = Nave.getState();
            if (!asNumber) {newValue = '"' + newValue + '"';}
            eval('state.' + expression + ' = ' + newValue)
            return Nave.setState(state);
        },
        prop : function(obj, prop) {
            return obj ? eval("obj." + prop) : "";
        },
        // Miscellaneous object helpers
        reduce : function(obj, callback) {
            if (obj instanceof Array) {
                return obj.reduce(function(concat, item, index) {
                    return concat += callback(item, index);
                }, '')
            } else {
                return Object.keys(obj).reduce(function(concat, key, index) {
                    return concat += callback(obj[key], key);
                }, '')                
            }
        },
        each : function(obj, callback) {
            if (obj instanceof Array) {
                obj.forEach(function(item, index) {
                    callback(item, index);
                })
            } else {
                Object.keys(obj).forEach(function(key, index) {
                    callback(obj[key], key, index);
                })                
            }
        },
        map : function(obj, callback) {
            if (obj instanceof Array) {
                return obj.map(function(item, index) {
                    return callback(item, index);
                })
            } else {
                var ret = {};
                Object.keys(obj).forEach(function(key, index) {
                    ret[key] = callback(obj[key], key, index);
                })
                return ret;
            }
        },
        mapArrToObj : function(arr, keyNameFn, itemFn) {
            var ret = {}
            Nave.each(arr, function(item, key) {
                ret[keyNameFn(item, key)] = itemFn(item, key);
            })
            return ret;
        },
        mapObjToArr : function(obj, itemFn) {
            var ret = [];
            Nave.each(obj, function(item, key) {
                ret.push(itemFn(item, key));
            })
            return ret;
        },
        merge : function(obj1, obj2) {
            if (obj1 instanceof Array) {
                Nave.each(obj1, function(item) {
                    ret.push(item);
                })
                Nave.each(obj2, function(item) {
                    ret.push(item);
                })
                return ret;
            } else {
                var ret = {};
                Nave.each(obj1, function(item, key) {
                    ret[key] = item;
                });
                Nave.each(obj2, function(item, key) {
                    ret[key] = item;
                })
                return ret;
            }
        },
        exists : function(obj, key) {
            return Object.keys(obj).indexOf(key) > -1;
        },
        empty : function(obj) {
            if (obj instanceof Array) {
                return !obj.length > 0;
            } else {
                return !Object.keys(obj).length > 0;                
            }
        },
        keyCount : function(obj) {
            return Object.keys(obj).length;
        },
        keyify : function(name) {
            return name.replace(" ", "_");
        },
        lastKey : function(obj) {
            return Object.keys(obj)[Object.keys(obj).length - 1];
        },
        guid : function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
    }
})();

var nv = Nave;

Nave.registerActions('nvBase', function(state, updateFn) {
    return {
        setPage : function(page) {
            state.nave.page = page;
            updateFn(state);
        }
    }
})
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
            var ret = Nave.reduce(form, function(item) {
                return Nave.renderObject(item, element, margin);
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
                eventTag = `${event}="Nave.updateStateValue('${update}', this.value, false)"`
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
            var header = obj.header || "";
            var list = obj.list;
            var valueParam = obj.valueParam;
            var headerText = "";
            if (header != "") {
                headerText = `<h4>${header}</h4>`;
            }
            return `${headerText}
                    <ul>    
                        ${Nave.reduce(list, function(item, streetIndex) {
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
        }
    }
)


Nave.registerService('local', {     
    get : function(key) {
        return JSON.parse(localStorage.getItem(key));
    }, 
    save : function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    exists : function(key) {
        return localStorage.getItem(key) ? true : false;
    }
});
