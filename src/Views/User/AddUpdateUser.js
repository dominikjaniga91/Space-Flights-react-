import React, {Component} from 'react';
import UserObject from "components/Atoms/Objects/UserObject";
import UserForm from 'components/Molecules/Form/UserForm';
import "Assets/fontello/css/fontello.css";
import { endpoints } from 'endpoints';
import { routes } from 'routes';
import Cookie from 'js-cookie';
import { Redirect } from "react-router-dom";

class AddUpdateUser extends Component {
    
    state = new UserObject(); 
    state = {
        error:'',
        isVisible: false,
        status: false,
        token: Cookie.get("jwt")
    }
    
    componentDidMount() {
  
        if(this.props.match.params.username !== undefined){
          
            fetch(endpoints.user + this.props.match.params.username,
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

         fetch(endpoints.user, {
            method: this.props.match.params.username !== undefined ? "PUT" : "POST",
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization': this.state.token
            },
            body: JSON.stringify(this.state)
        })
        .then(response => {

                if(response.status !== 200 || response.status !== 201){
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
            return <Redirect to={{ pathname: routes.users }} />
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
