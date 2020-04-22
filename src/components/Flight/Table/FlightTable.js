import React from 'react';
import { Link} from "react-router-dom";
import { Table } from "react-bootstrap";

const FlightTable = ({dataFlight, deleteFlight}) => (

        <Table className="flightTable" striped bordered hover size="sm" variant="light" responsive="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Destination</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Plane capacity</th>
              <th>Number of passengers</th>
              <th>Ticket price</th>
              <th id="actionColumn">Action</th>
            </tr>
          </thead>
          <tbody>
            {dataFlight.map(flight => (
              <tr key={flight.id}>
                <td>{flight.id}</td>
                <td>{flight.destination}</td>
                <td>{flight.startDate}</td>
                <td>{flight.finishDate}</td>
                <td>{flight.numberOfSeats}</td>
                <td>{flight.amountOfPassengers}</td>
                <td>{flight.ticketPrice}</td>
                <td>
                  <Link to={`/updateFlight/${flight.id}`}>
                    <i  className="icon-sliders" style={{ fontSize: "15px" }} />
                  </Link>
                  <Link to={`/flightPassengers/${flight.id}`}>
                    <i  className="icon-user-plus" style={{ fontSize: "16px" }} />
                  </Link>
                  <span >
                    <i  className="icon-trash-2" style={{ fontSize: "15px" }} 
                        onClick={() => {deleteFlight(flight.id)}} />
                  </span>
                </td>              
              </tr>
            ))}
            
          </tbody>
        </Table>




);

export default FlightTable;