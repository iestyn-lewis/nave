var Nave = (function() {
    var appName = "NaveApp";
    var history = [];
    var state;
    var m_layouts = {};
    var m_actions = {};
    var m_services = {};
    var m_listeners = {};
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
            // always rerender if there is no old state
            if (!oldState) { return true; }
            // if path is a function, call it with old and new state to determine the outcome
            if (path instanceof Function) {
                return path(oldState, state);
            } 
            // otherwise, evaluate the expressions passed in
            var oldProps = "";
            var props = "";
            if (path instanceof Array) {
                var oldPropsArr = Nave.map(path, function(item) {
                    return "oldState." + item;
                })
                oldProps = eval(oldPropsArr.join(" + "));
                var propsArr = Nave.map(path, function(item) {
                    return "state." + item;
                })
                props = eval(propsArr.join(" + ")); 
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
            var layout = m_layouts[layoutId];
            if (layout instanceof Function) {
                return layout();
            } else {
                return layout;            
            }
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
            var service =  m_services[serviceId];
            if (service instanceof Function) {
                return service();
            } else {
                return service;
            }
        },
        
        // LISTENERS
        // Listeners are called after a new state is set
        // They are listen-only, in that any changes they make
        // to state will be disregarded.
        registerListener : function(listenerId, listener) {
            m_listeners[listenerId] = listener;
        },
        listener : function(listenerId) {
            var listener = m_listeners[listenerId];
            if (listener instanceof Function) {
                return listener();
            }  else {
                return listener;
            }
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
            Nave.each(m_listeners, function(listener) {
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
        copy : function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
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
        filter : function(obj, callback) {
            var ret = {};
            if (obj instanceof Array) {
                var ret = [];
                obj.forEach(function(item, index) {
                    if (callback(item, index)) {
                        ret.push(item);
                    }
                })
            } else {
                Object.keys(obj).forEach(function(key, index) {
                    if (callback(obj[key], key, index)) {
                        ret[key] = obj[key];
                    }
                })
            }  
            return ret;
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
            if (obj instanceof Array) {
                return obj.indexOf(key) > - 1;
            } else {
                return Object.keys(obj).indexOf(key) > -1;            
            }
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