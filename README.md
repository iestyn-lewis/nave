# Nave - a small library for state-based Javascript applications
## Goals
I wrote Nave because I was tired of writing jQuery-based applications, but found Angular and React to be too much for what I was doing.  I liked the state-based architecture of React/Redux, and the idea of writing HTML-template components.  I wanted, as much as possible, to keep HTMl out of my code and even layout.  To that end Nave keeps all the HTML in layouts, which you then put together into pages by constructing standard javascript objects.
## State
Nave is based around The State.  The state is a single Javascript object that contains everything about your application, including data, settings, user preferences – everything.    
### Setting State
State can only be passed to Nave as a single, monolithic entity – you cannot set a single piece of the application state directly.  The usual workflow is:
    - Request a copy of the application’s current state from Nave.  (In practice, we often use Actions, which get state passed to them so you do not need to explicitly request state – more on that later).
    - Make changes to that state copy.
    - Send the whole state back to Nave, and Nave will update The Page based on the new state.
## Page
The Page is the translation of the application state to the application UI. It is represented in code as a single javascript object.  Each node in the object represents a page element, which will be rendered in the browser.
## Components
The 2 most important components of a Nave application are the State and the Page.  Nave defines several other components as well:
* State 

   The single object that contains all data relevant to the application.

* Layouts

   Layouts return snippets of HTML code that are used to build your page.  A layout takes a single object node and returns HTML based on the properties of that object node. 
   
* Pages

   Pages are collections of layouts that form a complete UI page.  Pages are automatically re-rendered by Nave whenever a new state is set.
   
* Actions

   Actions are functions that perform actions on The State, and can optionally send a new state back to Nave.  
   
* Services

   Services handle communication with things outside of your application - typically LocalStorage, REST APIs and web-based databases.

* Listener

   Listeners are notified by Nave whenever a new State is passed in.  Generally Listeners are used to persist state to local storage or to some offsite storage whenever the state changes.
   
* Init  

When the browser document is ready, you can start the Nave application by setting an initial state.  

## Installation
To enable Nave, include the Nave.js file in your HTML page.  You will probably also want to include NaveBaseLayouts.js to take advantage of the default layouts, NaveBaseActions.js to use default actions, and NaveBaseServices.js if you want to use the built in services such as LocalStorage and Firebase.
## Pages
Multiple Pages can be registered in your Nave application.  You tell Nave which page you want to render by setting a particular value in the State object:
```javascript
var state = {
    nave: {
        page: 'mypage'
    }
}
```
### Registering Pages
Pages are registered using the registerPage function.  This function should be called with 2 arguments:
* The name of the page you are registering.
* A function which takes a single argument - state - and returns a single object.  This object describes your page, using layouts.

In essence, the job of the page is to map the application's current state to its representation on the screen.  The page does this using layouts.

More on pages after we learn about layouts.

## Layouts

### Registering Layouts
Layouts are registered using the registerLayout function.  A Layout is an object that consists of multiple functions, or function that returns an object containing multiple functions.  Each function takes a single argument, which is an object with multiple properties.  The Layout returns a piece of HTML based on those properties.

For instance, here is a layout to return a piece of text in a header:

```javascript
nvHeader : function(obj) {
    var size = obj.size || 3;
    var text = obj.text;
    return `<h${size}>${text}</h${size}>`;
}
```

The argument object provides a text and optionally, a size, and the layout returns the text wrapped in a header tag.

### Using Layouts in Pages

The Page Object is a hierarchical strucure of nodes.  Each node has a layout property which defines the layout used to render that node.  The layout function that is referenced in the node will be called against the node.  The layout function will use the other parameters in the node to determine how to render the content.   

Nodes do not contain other nodes directly - instead there are layouts defined that take as arguments other nodes.  The nvForm layout is the simplest example of this.  The nvForm layout renders all of the layout nodes defined in the "form" property.  

There are 2 required properties in a node:

* id - this specifies the id of the node, and should be unique within the page.  
* layout - this specifies a function that has been registered using the registerLayout function.   

### Examples

The following examples assume that you have aliased the variable lb to the Nave base layouts, like so:

```javascript
var lb = Nave.layouts('nvBase');
```

This is a node that will render an input box:

```javascript
{
    id: 'username',
    layout:lb.nvInput,
    value: state.username,
    label: "Username",
    update: "username"
}
```
This is a node that will render 3 paragraphs of text:

```javascript
{
    id: 'paragraphs',
    layout: nvForm,
    form: [
        {
            id: 'para1',
            layout: lb.nvParagraph,
            text: 'First Paragraph'
        },
        {
            id: 'para2',
            layout: lb.nvParagraph,
            text: 'Second Paragraph'
        },
        {
            id: 'para3',
            layout: lb.nvParagraph,
            text: 'Third Paragraph'
        }
    ]
}
```
### Visibility
Nodes can be shown and hidden with the visible parameter.  True will show the node, while false will hide the node.

### Updating
At application start, the container div of the Nave app will be empty, so the entire page will be rendered.  However, on subsequent renders, by default, the nodes will not be rerendered.  In order to trigger rerendering, you must include the trigger parameter. The trigger parameter is either a string or an array of strings.  These strings are "paths" into the state object.  If Nave determines that the values returned by the state paths don't match, the node will be rerendered.  If the values are identical, the component will not be rerendered.

If you want the node to be rerendered every time state is updated, the trigger parameter should be a single asterix: "*"

For instance, if you have a state object like this:

```javascript
{
    nave: {
        page: "main"
    },
    message: "This is the message"
}
```

And a node like this:

```javascript
{
    id: "message",
    layout: lb.nvHeader,
    text: state.message
}
```

That node would render on page load and remain constant, even if the message changed.

To enable the node to change, either of the following would work:

```javascript
{
    id: "message",
    layout: lb.nvHeader,
    trigger: "message"
    text: state.message
}    

{
    id: "message",
    layout: lb.nvHeader,
    trigger: "*",
    text: state.message
}

```

## Application Setup
Nave application bootstrapping is as follows:

1. The Nave library is included.
2. Optionally, the Base libraries are included (Actions, Layouts, and Services)
3. User defined layouts, actions, services and listeners are included.
4. The application is initialized by setting an initial state.

## Init
The init file sets initial state on document ready.  A simple init file would be as follows:

```javascript
$(document).ready(function() {
   Nave.setState(
        {
            nave: {
                page: 'cities'
            },
            mode: "display",
            loading: false
        }
   );
});
```
## Application Flow

Every time the function Nave.setState is called, Nave will push the current state onto the history, and replace it with the passed-in state.  Nave will then retrieve the page object specified in the state.nave.page parameter, and render it using the current state as input.  

State generally changes in response to user actions, or in response to new data coming in via a service.

## Actions

Actions are registered using the Nave.registerActions function.  Similarly to layouts, this function is used to register a library of related actions.  These actions can be retrieved later on with the Nave.actions('action_name') function.  

When actions are called, they are passed a copy of the current state, and a pointer back to the Nave.updateState function.

Actions can be used to either return a value from state (for instance, if it is necessary to use mulitple pieces of state to calculate a value), or they can be used to modify the state.  

No action will be taken by Nave until the action calls the update function:

```javascript
updateFn(state);
```

At this point, Nave will rerender the application based on the state. 

