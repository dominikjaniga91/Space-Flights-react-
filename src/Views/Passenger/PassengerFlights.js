import React, {Component} from 'react';
import MyButton from 'components/Atoms/Button/MyButton';
import AvailableFlightsTable from 'components/Orgamisms/PassengerTables/AvailableFlightsTable';
import PassengerFlightsTable from 'components/Orgamisms/PassengerTables/PassengerFlightsTable';
import styles from './PassengerFlights.module.scss'
import { endpoints } from 'endpoints';
import { routes } from 'routes';
import Cookie from 'js-cookie';
import Header from 'components/Orgamisms/Header/Header';


class PassengerFlights extends Component {
    
constructor(props) {
    super(props)
    this.state = {
        flightsId: [], 
        dataFlightPassenger: [], 
        dataFlight: [], 
        token: Cookie.get("jwt")
    };
    this.loadPassengerFlights();
}
    
    //load passenger's flights
    loadPassengerFlights = () => {
        
        if(this.props.match.params.id !== undefined){
            
            fetch(endpoints.passengerFlights + this.props.match.params.id,
            {
                headers: {'Authorization': this.state.token}
            })    
            .then(response => response.json())
            .then(result =>  { 
                console.log(result)
                this.setState({ dataFlightPassenger: result })
             }).catch(error => console.log(error));
            
        }
    }

    componentDidMount() {
        fetch(endpoints.flights,
        {
            headers: {'Authorization': this.state.token}
        })
        .then(response => response.json())
        .then(result =>  { 
            console.log(result)
            this.setState({ dataFlight: result })
        }).catch(error => console.log(error));
    }

    deleteFlightFromPassenger = (flightId) => {

        if((window.confirm(" Are you sure ?"))){
            fetch(endpoints.passengerFlights + this.props.match.params.id + "/" + flightId , {
                method: "DELETE",
                headers: {'Authorization': this.state.token}
             })
            .then(result => console.log(result))
            .catch(error => console.log(error));

            const items = this.state.dataFlightPassenger.filter(item => item.id !== flightId);
            this.setState({ dataFlightPassenger: items });
        }
    }

    // zapis do backendu
    saveFlights = event => {
        event.preventDefault();
        fetch(endpoints.passengerFlights + this.props.match.params.id, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization': this.state.token
            },
            mode: 'cors',
            body: JSON.stringify(this.state.flightsId)
        })
        .then(response => console.log(response))
        .catch(error => console.log(error));

        this.props.history.push(routes.passengers);
    }

    addToFlight = (flightId) => {
        
        const newData = this.state.dataFlight.filter( flight => flight.id === flightId);

        this.setState(prevState => ({ 
            dataFlightPassenger: [...prevState.dataFlightPassenger, ...newData],
            flightsId: [...prevState.flightsId, newData[0].id],
        }));
    }
    
    render() {
        
        return (
            <>
                <Header />
                <div className={styles.table}>
                    <PassengerFlightsTable 
                        dataFlightPassenger={this.state.dataFlightPassenger}
                        deleteFlightFromPassenger ={this.deleteFlightFromPassenger}
                    />
                    <AvailableFlightsTable 
                        dataFlight={this.state.dataFlight}
                        addToFlight={this.addToFlight}
                    />               
                    
                </div>
                <div className={styles.buttons}>
                    <MyButton onClick={() => this.props.history.goBack()}>Cancel</MyButton>
                        &nbsp;
                    <MyButton onClick={this.saveFlights}>Save</MyButton>
                </div>
            </>
        );
    }
}

export default PassengerFlights;

