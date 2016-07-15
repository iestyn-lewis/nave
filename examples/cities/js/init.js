$(document).ready(function() {
   Nave.setState(
        {
            nave: {
                page: 'cities'
            },
            username: "ilewis",
            password: "password",
            authenticated: false,
            cities: [],
            selectedCityIndex: -1,
            mode: "display",
            loading: false
        }
   );
});