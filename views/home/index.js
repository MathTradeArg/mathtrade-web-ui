import { useEffect, useState } from "react";
import PrivateLayout from "layouts/private";

const api = "https://mathtrade-back.herokuapp.com"
const HomeView = () => {

  const [locations, setLocations] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetch(api + '/api/locations/?format=json')
    .then(response => response.json())
    .then(setLocations);
  }, [])

  const handlerLogin = () => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("content-Type", "application/json");

    const user = {
      "username": "mathadmin",
      "password": "<PASS>"
      };
    const request = {
      headers: myHeaders,
      method: "POST",
      body: JSON.stringify(user) 
    }
    fetch(api + '/api-token-auth/', request)
    .then(response => response.json())
    .then(setToken);
  };

  const handlerClick = () => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Token " + token.token);
    //myHeaders.append("Access-Control-Allow-Origin", "*");

    const user = {
      "first_name": "test",   
      "last_name":"test",
      "email":"sorsergios@gmail.com",
      "phone":"123123123",
      "whatsapp":"123123123",
      "telegram":"usuario",
      "comment":"This field is required.",
      "caba_present": false,
      "volunteer": false,
      "car_owner": false,
      "referred":"none",
      "location": api + "/api/locations/1/"
      };
    const request = {
      headers: myHeaders,
      method: "POST",
      body: JSON.stringify(user) 
    }
    fetch(api + '/api/users/', request)
    .then(response => response.json())
    .then(console.log);
  };

  return <PrivateLayout>
    <div>
      <h1>Localidades</h1>
      <ul>
        {locations.map(location =>
          (
            <li key={location.name}>
              {location.name}
            </li>
          ))}
      </ul>
      <button onClick={handlerLogin}>login</button>
      <button onClick={handlerClick}>agregar</button>
    </div>
  </PrivateLayout>;
};

export default HomeView;
