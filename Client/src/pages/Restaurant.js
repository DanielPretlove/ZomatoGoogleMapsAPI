import React, { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import {toJS} from 'mobx'; // TOJS allows us to get rid of the (Proxy) value if it gets returned by the store. Essentially always wrap your stored values with ToJS.
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';


/* gets the zomato endpoint from the server */
export async function getRestaurantsFromAPI(id) {

    const url = "http://" + window.location.hostname + `:3000/location_details/${id}/city`;

    let restaurant = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(response => {
            return response
        })

    return restaurant;
}

/* searches for the city_id when onSearch */
function Searchbar(props) {
    const [innerSearch, setInnerSearch] = useState("");

    return (
        <div>
            <div className="Search">
                <input
                    aria-labelledby="search-button"
                    type="text"
                    placeholder="search for city id....."
                    name="search"
                    id="search"
                    value={innerSearch}
                    onChange={(e) => {
                        setInnerSearch(e.target.value);
                    }}
                />
                <button onClick={async () => {
                    if (innerSearch !== "") {
                        await props.onSearch(innerSearch);
                    }

                   
 
                }}>Search</button>
                <button onClick={() => {
                    if (innerSearch !== "") {
                        setInnerSearch("");
                    }
                }}>Clear</button>
            </div>
        </div>

    )
}

/*
*       OBSERVER -> MobX Observer will wait and observe for any changes made inside of our Store.JS, When a change is made. it will pick the change up.      
*                   This also goes for setting the value in store, essentially it allows us to access the global state.
*/

const Restaurant = observer((props) => {
    const history = useHistory();
    const [restaurants_list, setRestaruant] = useState([]);
    
    const restaurants_body = [
        {
            headerName: "Restaurant ID",
            field: "id",
            flex: 1,
            sortable: true,
        },

        {
            headerName: "Name",
            field: "name",
            flex: 1,
            sortable: true,
        },
        {
            headerName: "Latitude",
            field: "location.latitude",
            flex: 1,
            sortable: true,
        },

        {
            headerName: "Longitude",
            field: "location.longitude",
            flex: 1,
        },

        {
            headerName: "Address",
            field: "location.address",
            flex: 1,
        },

        {
            headerName: "City",
            field: "location.city",
            flex: 1,
        },
    ];

    return (
        <div className="Restaurants">
            <h2>Search for restaurants by location id</h2>
            <Searchbar
                /* returns a promise of id, from the API being fetched*/
                onSearch={async (id) => {
                    /* awaits for the id data to be called */
                    let restaurants_data = await getRestaurantsFromAPI(id).catch(() =>
                            history.push('/Error')
                        );
               
                    /* error handling conditions */
                        props.store.restaurants = restaurants_data;
                        const tempData = toJS(props.store.restaurants)?.best_rated_restaurant?.map((rest) => {
                            return rest.restaurant;
                        });

                        setRestaruant(tempData);

                        if(!tempData) {
                            history.push('/Error')
                        }
                       
                }}
            />
            <h2>List of Restaurants</h2>
            <div className="ag-theme-balham">
                <AgGridReact
                    suppressLoadingOverlay={true}
                    columnDefs={restaurants_body}
                    rowData={restaurants_list}
                    /* the map page is able to use these json data with a global state */
                    onRowClicked={row => history.push(`/Maps`, {
                        name: row.data.name,
                        resId: row.data.id,
                        city: row.data.location.city,
                        address: row.data.location.address,
                        latitude: row.data.location.latitude,
                        longitude: row.data.location.longitude
                    })}
                    pagination={true}
                    paginationPageSize={50}
                />
            </div>
        </div>
    )
});

export default Restaurant; 
