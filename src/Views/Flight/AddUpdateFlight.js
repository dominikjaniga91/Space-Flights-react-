import React, {Component} from 'react';
import FlightObject from "components/Atoms/Objects/FlightObject";
import FlightForm from 'components/Molecules/Form/FlightForm';
import "Assets/fontello/css/fontello.css";
import { endpoints } from 'endpoints';
import { routes } from 'routes';
import Cookie from 'js-cookie';
import Header from 'components/Orgamisms/Header/Header';
import { Redirect } from "react-router-dom";

 
class AddUpdateFlight extends Component {
    
    state = new FlightObject(); 
    state = {
        error:'',
        isVisible: false,
        status: false,
        token: Cookie.get("jwt")
    }
    
    componentDidMount() {
        
        if(this.props.match.params.id !== undefined){
              
            fetch(endpoints.flight + this.props.match.params.id,
            {
                headers: {'Authorization': this.state.token}
            })
            .then(response => response.json())
            .then(result =>  {
                console.log(result)
                this.setState(result )
            }).catch(error => console.log(error));
        }
    }

    handleChange = event => {
        const newValue = event.target.type === 'number'
                          ? parseInt(event.target.value)
                          : event.target.value;
        const fieldName = event.target.name; 
        const updatedState = { [fieldName]:newValue}; 
        this.setState( updatedState);
    }

    handleSubmit = event => {
        event.preventDefault();
    
         fetch(endpoints.flight, {
            method: this.props.match.params.id !== undefined ? "PUT" : "POST",
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': this.state.token
            },
            body: JSON.stringify(this.state)
        })
        .then(response => {

                if(response.status !== 201){
                    response.json().then(data => { 
                        this.setState(
                            {error: data.detail, isVisible: true })
                       
                       });
                }else {
                     this.setState({ status: true})
                };    
        }).catch(error => console.log(error));
  
            
    }
    
    render() {

        if(this.state.status){
            return <Redirect to={{ pathname: routes.flights }} />
        }else {
            return (
                <>  
                    <Header />
                    <FlightForm
                        error={this.state.error}
                        isVisible={this.state.isVisible} 
                        flight={this.state} 
                        onSubmit={this.handleSubmit} 
                        onChange={this.handleChange}
                        historyBack={() => this.props.history.goBack()}
                    />
                </>
            );
    }
}
}

export default AddUpdateFlight;
