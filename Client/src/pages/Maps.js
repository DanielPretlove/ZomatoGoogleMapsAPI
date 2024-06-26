import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { toJS } from 'mobx';
import { observer } from "mobx-react";
import { useHistory } from 'react-router-dom';
import MapStyles from './MapStyles';
const API_KEY = 'AIzaSyDb1D4RL292JnliF9H5BfR7TxTtN1XZIxo';


const Maps = observer((props) => {
  const history = useHistory();
  /* gets the SelectedRestaurant and filter it by the restaurant id for you to get the restaurant you have selected */
  const Restaurants = toJS(props.store.restaurants.best_rated_restaurant)?.filter(r => r.restaurant.id === history.location.state.resId);
  const SelectedRestaurant = Array.isArray(Restaurants) ? Restaurants[0].restaurant : undefined;

  /* import the google maps api and searches for the location with the latitude and longitude destinations*/
  const MapWithAMarker = withScriptjs(withGoogleMap(props =>
    <GoogleMap

      defaultOptions={{
        styles: MapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: true,
      }}
      defaultZoom={17}
      defaultCenter={{ lat: Number(SelectedRestaurant.location.latitude), lng: Number(SelectedRestaurant.location.longitude) }}
    >
      <Marker
        position={{ lat: Number(SelectedRestaurant.location.latitude), lng: Number(SelectedRestaurant.location.longitude) }}>
        <InfoWindow>
          <p>{SelectedRestaurant.location.address}</p>
        </InfoWindow>
      </Marker>
    </GoogleMap>
  ));


  return (
    <div className="GoogleMaps">

      <h2>{SelectedRestaurant ? SelectedRestaurant.name + " in " + SelectedRestaurant.location.city : "No Data"}</h2>
      {SelectedRestaurant ?
        <MapWithAMarker
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `765px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        /> : <h2>Cannot load Map Data</h2>}


    </div>
  )
});

export default Maps;