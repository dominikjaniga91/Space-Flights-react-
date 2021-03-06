import React, {Component} from 'react';
import FlightPassengersTable from 'components/Orgamisms/FlightTables/FlightPassengersTable';
import AvailablePassengersTable from 'components/Orgamisms/FlightTables/AvailablePassengersTable';
import styles from './FlightPassengers.module.scss';
import MyButton from 'components/Atoms/Button/MyButton';
import { endpoints } from 'endpoints';
import { routes } from 'routes';
import Cookie from 'js-cookie';
import Header from 'components/Orgamisms/Header/Header';



class FlightPassenges extends Component {
    
constructor(props) {
    super(props)
    this.state = {
        passengers: [], 
        dataPassenger: [], 
        dataFlight: [],
        token: Cookie.get("jwt") 
    };
    this.loadFlightsPassengers();
}
    
    //load flights passengers
    loadFlightsPassengers = () => {
        
        if(this.props.match.params.id !== undefined){
            
            fetch(endpoints.flightPassengers + this.props.match.params.id,
            {
                headers: {'Authorization': this.state.token}
            })
            .then(response => response.json())
            .then(result =>  { 
                console.log(result)
                this.setState({ dataFlight: result })
            }).catch(error => console.log(error));
            
        }
    }

    componentDidMount() {
        
        fetch(endpoints.passengers,
        {
            headers: {'Authorization': this.state.token}
        })
        .then(response => response.json())
        .then(result =>  { 
            console.log(result)
            this.setState({ dataPassenger: result })
        })
        .catch(error => console.log(error));
      }

    deletePassengerFromFlight = (myId) => {
        
        if((window.confirm("Are you sure  ?"))){

            fetch(endpoints.flightPassengers + this.props.match.params.id + "/" + myId, {
                method: "DELETE",
                headers: {'Authorization': this.state.token} 
            })
            .then(result =>  console.log(result))
            .catch(error => console.log(error));
            
            const items = this.state.dataFlight.filter(item => item.id !== myId);
            this.setState({ dataFlight: items });
        }
    }

    addToFlight = (passengerId) => {
        
        const newData = this.state.dataPassenger.filter( passenger => passenger.id === passengerId);

        this.setState(prevState => ({ 
            dataFlight: [...prevState.dataFlight, ...newData],
            passengers: [...prevState.passengers, newData[0].id],
        }));
    }

    // zapis do backendu ('bazy danych')
    savePassengers = event => {
        event.preventDefault();
        
        fetch(endpoints.flightPassengers + this.props.match.params.id, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
                'Authorization': this.state.token
            },
            body: JSON.stringify(this.state.passengers)
        })
        .then(response => console.log(response))
        .catch(error => console.log(error));

        this.props.history.push(routes.flights);
    }
    
    render() {
    
        return (
            <>
            <Header />
                <div className={styles.table}>
                    <FlightPassengersTable 
                        dataFlight ={this.state.dataFlight}
                        deletePassengerFromFlight = {this.deletePassengerFromFlight}
                    /> 
                     <AvailablePassengersTable 
                        dataPassenger={this.state.dataPassenger}
                        addToFlight={this.addToFlight}
                    />   
                </div>
                <div className={styles.buttons}>
                    <MyButton onClick={() => this.props.history.goBack()}>Cancel</MyButton>
                        &nbsp;
                    <MyButton onClick={this.savePassengers}>Save</MyButton>
                </div>
            </>
        );
    }
}

export default FlightPassenges;
