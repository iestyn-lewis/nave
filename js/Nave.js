var Nave = (function() {
    var appName = "NaveApp";
    var logLevel = 0;
    var history = [];
    var state;
    var layouts = {};
    var m_actions = {};
    var moderators = {};
    var services = {};
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
            var p = pages[pageId](state, layouts);
            var targetDiv = $('.' + appName);
            var ret = Nave.renderObject(p, "app");
            if (targetDiv.html().trim() == "" || newPage) {
                targetDiv.html(ret);  
            }
        },
        renderObject : function(item, key, element, style) {
            // construct html string 
            element = element || "div";
            style = style || "";
            var id = ""
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
                    if (item.reRenderOnChange) {
                        if (item.reRenderOnChange == "*") {
                            reRender = true;
                        } else {
                            reRender = Nave.checkReRender(item.reRenderOnChange);                
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
            var oldProps = eval('oldState.' + path);
            var props = eval('state.' + path);
            return !(JSON.stringify(oldProps) === JSON.stringify(props));
        },
        
        // LAYOUTS - template html that can be parameterized
        // at design time - not at runtime
        registerLayouts : function(layoutId, layout) {
            layouts[layoutId] = layout;
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
            services[serviceId] = service;
        },
        service : function(serviceId) {
            return services[serviceId];
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
                Object.keys(obj).each(function(key, index) {
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
        mapObjToArr : function(obj) {
            var ret = [];
            Nave.each(obj, function(item) {
                ret.push(item);
            })
            return ret;
        },
        exists : function(obj, key) {
            return Object.keys(obj).indexOf(key) > -1;
        },
        empty : function(obj) {
            return !Object.keys(obj).length > 0;
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