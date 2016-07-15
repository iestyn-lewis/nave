Nave.registerPage('cities', function(state) {
    var lb = Nave.layouts('nvBase');
    var ct = Nave.layouts('cities');
    var authenticated = state.authenticated;
    var selectedCity = state.cities[state.selectedCityIndex];
    var cityListLayout = Nave.map(state.cities, function(city, index) {
        return {
            id: 'city_row_' + index,
            layout: lb.nvTableRow,
            cols: [
                {
                    id: 'colname_' + index,
                    layout: lb.nvLink,
                    text: city.name,
                    onclick: `Nave.updateStateValue('selectedCityIndex', ${index}, true)`
                },
                {
                    id: 'colstate_' + index,
                    html: city.state
                },
                {
                    id: 'coldelete_' + index,
                    layout: lb.nvButton,
                    onclick: `Nave.actions('city').delete(${index})`,
                    classname: "btn btn-sm btn-danger",
                    text: "X"
                }                        
            ]
        }
    });
        
     var loginForm = [
        {
            id: 'username',
            layout:lb.nvInput,
            value: state.username,
            label: "Username",
            update: "username"
        },
        {
            id: 'password',
            layout:lb.nvInput,
            value: state.password,
            password: true,
            label: "Password",
            update: "password"
        },
        {
            id: 'loginBtn', 
            layout:lb.nvButton,
            onclick: "Nave.actions('login').login()",
            classname: "btn btn-success",
            text: "Login"
        }                
     ];
    
    var detailDisplayForm = [
        {
            id: 'pop',
            layout: lb.nvParagraph,
            header: "Population",
            text: nv.prop(selectedCity,"population")
        },
        {
            id: 'state',
            layout: lb.nvParagraph,
            header: "State",
            text: nv.prop(selectedCity,"state")
        },
        {
            id: 'streets',
            layout: lb.nvList,
            header: "Streets",
            list: nv.prop(selectedCity,"streets")
        },
        {
            id: 'editBtn',
            layout: lb.nvButton,
            classname: "btn btn-info",
            text: "Edit",
            onclick: "Nave.updateStateValue('mode', 'edit')"
        }
    ];
    
    var detailEditForm = [
        {
            id: 'editName',
            layout:lb.nvInput,
            label: "City",
            update: "cities[state.selectedCityIndex].name",
            value: nv.prop(selectedCity,"name")
        },
        {
            id: 'editPop',
            layout:lb.nvInput,
            label: "Population",
            update: "cities[state.selectedCityIndex].population",
            value: nv.prop(selectedCity,"population")
        },
        {
            id: 'editState',
            layout:lb.nvInput,
            label: "State",
            update: "cities[state.selectedCityIndex].state",
            value: nv.prop(selectedCity,"state")
        },
        {
            id: 'saveBtn',
            layout: lb.nvButton,
            classname: "btn btn-info",
            text: "Done",
            onclick: "Nave.updateStateValue('mode', 'display')"
        }
    ];
    
    var uiModule = {
        id: 'uiModule',
        layout: lb.nvColumns,
        columns: [
            {
                id: 'list',
                width: 8,
                title: "cities",
                layout:lb.nvTable,
                trigger: "*",
                headers: ["Name","State","Delete"],
                rows: cityListLayout
            },
            {
                id: 'detail',
                visible: state.selectedCityIndex >= 0,
                trigger: "selectedCityIndex",
                width: 4,
                layout: lb.nvForm,
                form: [
                    {
                        id: 'detailDisplay',
                        layout:lb.nvForm,
                        visible: state.mode == 'display',
                        title: nv.prop(selectedCity, "name"),
                        form: detailDisplayForm
                    },
                    {
                        id: 'detailEdit',
                        layout:lb.nvForm,
                        visible: state.mode == 'edit',
                        title: "Edit City",
                        form: detailEditForm                         
                    }
                ]
            }
        ]          
    };
    
    var addCityButton = {
        id: 'addCityButton',
        layout: lb.nvButton,
        text: "Add City",
        classname: "btn btn-success",
        onclick: "Nave.actions('city').new()"
    };
    
    return {
        id: 'citiesApp',
        layout: lb.nvForm,
        form: [
           {
                id: 'appTitle',
                layout: lb.nvHeader,
                size: 1,
                text: "City Database"
            },
            {
                id: 'login',
                visible: !state.authenticated,
                layout: lb.nvForm,
                form: loginForm,
            },
            {
                id: 'loading',
                layout: lb.nvHeader,
                trigger: ["loading", "authenticated"],
                visible: state.loading,
                size: 4,
                text: state.authenticated ? "Loading, please wait..." : "Logging in, please wait..."
            },
            {
                id: 'main',
                visible: state.authenticated && !state.loading,
                layout: lb.nvForm,
                form: [
                    uiModule,
                    addCityButton
                ]
            }
        ]                
    };    
})
        