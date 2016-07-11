// We register a layout that presents text.  When clicked, the 
// text changes into an edit box.  Shows how to compose layouts
// from simpler existing layouts.

Nave.registerLayouts('todo', {
    editableText : function(obj) {
        var value = obj.value || "";
        var text_action = obj.text_action;
        var edit_action = obj.edit_action;
        var mode = obj.mode;
        if (mode == "text") {
            return Nave.layouts('nvBase').nvLink({
                text: value,
                onclick: text_action
            });
        } else {
            return Nave.layouts('nvBase').nvInput({
                value: value,
                action: edit_action
            });
        }
    }
})