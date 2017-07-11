Nave.registerPage('gallery', function(state) {
    var lb = Nave.layouts('nvBase');
    var gl = Nave.layouts('gallery');
    return {
        id: "gallery",
        layout: lb.nvForm,
        form: [
            {
                id: "header-basic",
                layout: lb.nvHeader,
                text: "Text Layout",
                size: 1
            },
            {
                id: "header",
                layout: gl.nvLayoutDisplay,
                name: "nvHeader",
                example: {
                    layout: lb.nvHeader,
                    text: "This is an nvHeader of size 3",
                    size: 3
                },
                params: ["size: header size (1-5)", "text: header text"]
            },
            {
                id: "label",
                layout: gl.nvLayoutDisplay,
                name: "nvLabel",
                example: {
                    layout: lb.nvLabel,
                    text: "This is an nvLabel"
                },
                params: ["text: label text"]
            },  
            {
                id: "paragraph",
                layout: gl.nvLayoutDisplay,
                name: "nvParagraph",
                example: {
                    layout: lb.nvParagraph,
                    header: "Paragraph Header",
                    text: "This is an nvParagraph"
                },
                params: ["text: paragraph text"]
            }, 
            {
                id: "list",
                layout: gl.nvLayoutDisplay,
                name: "nvList",
                example: {
                    layout: lb.nvList,
                    header: "List Header",
                    list: ["These", "are", "nvList", "items"]
                },
                params: ["header: list header",
                         "list: collection of list items",
                         "valueParam: optional indicator of which item property should be shown in the list (if items are objects or arrays)"]
            },            
            {
                id: "spacer",
                layout: gl.nvLayoutDisplay,
                name: "nvSpacer",
                example: {
                    layout: lb.nvSpacer,
                    line: true
                },
                params: []
            },
            {
                id: "header-form",
                layout: lb.nvHeader,
                text: "Form Controls",
                size: 1
            },
            {
                id: "input",
                layout: gl.nvLayoutDisplay,
                name: "nvInput",
                example: {
                    layout: lb.nvInput,
                    label: "This is an nvInput",
                    value: "Input Value"
                },
                params: ["label: input label", 
                         "value: input value",
                         "numeric: true if this is a numeric value (default false)",
                         "password: true if input should be masked (default false)",
                         "focusOnCreate: true if Nave should set focus to this control when it appears on the page",
                         "selectTextOnFocus: true if all text in the control should be selected when it appears on the page",
                         "cursorToEndOnFocus: true if the cursor should be placed at the end of the control text when it appears on the page",
                         "event: event upon which to fire action code (defaults to onchange) ",
                         "action: js code to execute on event",
                         "update: piece of state to update when event is fired (used in place of action) "
                        ]
            },  
            {
                id: "textarea",
                layout: gl.nvLayoutDisplay,
                name: "nvTextArea",
                example: {
                    layout: lb.nvTextArea,
                    label: "This is an nvTextArea",
                    value: "TextArea Value"
                },
                params: ["label: input label", 
                         "value: textarea value",
                         "rows: number of rows in textarea (default 2)",
                         "event: event upon which to fire action code (defaults to onchange) ",
                         "action: js code to execute on event",
                         "update: piece of state to update when event is fired (used in place of action) "
                        ]
            },     
            {
                id: "select",
                layout: gl.nvLayoutDisplay,
                name: "nvSelect",
                example: {
                    layout: lb.nvSelect,
                    label: "This is an nvSelect",
                    emptyValue: "0",
                    emptyOption: "--Select a value--",
                    values: ["1", "2"],
                    selectedCompare: 0
                },
                params: ["label: select label", 
                         "size: number of items shown, default 1",
                         "values: collection of objects for select",
                         "keyParam: object property to use as key (hidden)",
                         "valueParam: object property to use as value (shown)",
                         "extraOptions: additional objects to be shown in select.  Objects must have value (hidden) and display (shown) properties",
                         "emptyOption: display value for the empty (no selection) option",
                         "emptyValue: hidden value for the empty (no selection) option",
                         "selectedCompare: value to be used to determine the selected option",
                         "event: event upon which to fire action code (defaults to onchange) ",
                         "action: js code to execute on event",
                         "update: piece of state to update when event is fired (used in place of action) "
                        ]
            },
            {
                id: "checkbox",
                layout: gl.nvLayoutDisplay,
                name: "nvCheckbox",
                example: {
                    layout: lb.nvCheckbox,
                    label: "This is an nvCheckbox",
                    checked: true
                },
                params: ["label: checkbox label", 
                         "checked: checkbox state",
                         "onchange: js code to execute on checkbox change",
                         "update: piece of state to update when checkbox changes (used in place of action) "
                        ]
            },
            {
                id: "file",
                layout: gl.nvLayoutDisplay,
                name: "nvFile",
                example: {
                    layout: lb.nvFile,
                    label: "This is an nvFile"
                },
                params: ["label: file upload label", 
                         "onchange: js code to execute on file selector change"]
            },             
            {
                id: "link",
                layout: gl.nvLayoutDisplay,
                name: "nvLink",
                example: {
                    layout: lb.nvLink,
                    text: "This is an nvLink",
                    onclick: "alert('You clicked the link')"
                },
                params: ["text: link text", 
                         "href: link target",
                         "onclick: js code to execute on link click"]
            },
            {
                id: "button",
                layout: gl.nvLayoutDisplay,
                name: "nvButton",
                example: {
                    layout: lb.nvButton,
                    text: "This is an nvButton",
                    onclick: "alert('You clicked the button')",
                    classname: "btn btn-default"
                },
                params: ["text: button text", 
                         "classname: Bootstrap class names to style button",
                         "onclick: js code to execute on button click"]
            },   
            {
                id: "header-page",
                layout: lb.nvHeader,
                text: "Page Layout",
                size: 1
            },   
            {
                id: "form-example",
                layout: gl.nvLayoutDisplay,
                name: "nvForm",
                example: {
                    layout: lb.nvForm,
                    form: [
                        {
                            id: "form-1",
                            layout: lb.nvInput,
                            label: "Vertical",
                            value: "Vertical"
                        },
                        {
                            id: "form-2",
                            layout: lb.nvInput,
                            label: "Form",
                            value: "Form"
                        },
                        {
                            id: "form-3",
                            layout: lb.nvInput,
                            label: "Layout",
                            value: "Layout"
                        }
                    ]
                },
                params: ["horizontal: true to put items side by side", 
                         "form: collection of layouts to include in form"]
            },
            {
                id: "panel",
                layout: gl.nvLayoutDisplay,
                name: "nvPanel",
                example: {
                    layout: lb.nvPanel,
                    header: "Panel Header",
                    content: {
                        layout: lb.nvParagraph,
                        text: "Panel Content"
                    }
                },
                params: ["header: panel header text", 
                         "headerSize: size for panel header text",
                         "content: layout with content for panel"]
            },             
            {
                id: "table",
                layout: gl.nvLayoutDisplay,
                name: "nvTable",
                example: {
                    layout: lb.nvTable,
                    headers: ["Column 1", "Column 2"],
                    rows: [
                        {
                            id: "row-1",
                            layout: lb.nvTableRow,
                            cols: [
                                {
                                    html: "Value 1"
                                },
                                {
                                    html: "Value 2"
                                }
                            ]
                        }
                    ]
                },
                params: ["headers: A collection of column headers", 
                         "rows: A collection of layouts (usually nvTableRow, which itself has one collection called cols, each of which contains the content to render in that column)"
                         ]
            },          
            {
                id: "columns",
                layout: gl.nvLayoutDisplay,
                name: "nvColumns",
                example: {
                    layout: lb.nvColumns,
                    headers: ["Column 1", "Column 2"],
                    widths: [6,6],
                    columns: [
                        {
                            id: "col-1",
                            layout: lb.nvParagraph,
                            text: "This is Column 1"
                        },
                        {
                            id: "col-2",
                            layout: lb.nvParagraph,
                            text: "This is Column 2"
                        }
                    ]
                },
                params: ["headers: A collection of column headers",
                         "widths: A collection of widths, using Bootstrap column widths, which can sum to 12", 
                         "columns: A collection of layouts, one for each column"
                         ]
            },
            {
                id: "tabs",
                layout: gl.nvLayoutDisplay,
                name: "nvTabs",
                example: {
                    layout: lb.nvTabs,
                    headers: ["Tab 1", "Tab 2"],
                    activeTab: "Tab 1",
                    tabs: [
                        {
                            id: "tab-1",
                            layout: lb.nvParagraph,
                            text: "This is Tab 1"
                        },
                        {
                            id: "tab-2",
                            layout: lb.nvParagraph,
                            text: "This is Tab 2"
                        }
                    ]
                },
                params: ["headers: A collection of tab texts",
                         "activeTab: The tab text which should be active", 
                         "tabs: A collection of layouts, one for each tab"
                         ]
            }
        ]
    }
})