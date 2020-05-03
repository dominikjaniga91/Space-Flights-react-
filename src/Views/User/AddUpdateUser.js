import React, {Component} from 'react';
import UserObject from "components/Atoms/Objects/UserObject";
import UserForm from 'components/Molecules/Form/UserForm';
import "Assets/fontello/css/fontello.css";
import { endpoints } from 'endpoints';
import { routes } from 'routes';
import Cookie from 'js-cookie';
import Header from 'components/Orgamisms/Header/Header';
import { Redirect } from "react-router-dom";

const token = Cookie.get("jwt");

class AddUpdateUser extends Component {
    
    state = new UserObject(); 
    state = {
        error:'',
        isVisible: false,
        status: false
    }
    
    componentDidMount() {

        const username = Cookie.get("username");
        
        if(username !== undefined){
              
            fetch(endpoints.user + username,
            {
                headers: {'Authorization': token}
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
    
         fetch(endpoints.user, {
            method: this.props.match.params.id !== undefined ? "PUT" : "POST",
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': token
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
                    
                    <UserForm
                        error={this.state.error}
                        isVisible={this.state.isVisible} 
                        user={this.state} 
                        onSubmit={this.handleSubmit} 
                        onChange={this.handleChange}
                        historyBack={() => this.props.history.goBack()}
                    />
                </>
            );
    }
}
}

export default AddUpdateUser;