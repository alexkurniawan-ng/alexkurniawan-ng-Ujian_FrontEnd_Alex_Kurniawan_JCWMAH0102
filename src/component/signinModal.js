import React from 'react';
import { Modal, ModalHeader, ModalBody, Form, Alert, FormGroup, Label, Input, Button, ModalFooter} from 'reactstrap'
import { API_URL } from '../support/url';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect} from 'react-redux';
import { login, Login } from '../redux/actions';

class SignInModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            username: "",
            password: "",
            modalOpen: false,
            alertMessage: '',
            alertIsOpen: false,
            alertColor: '',
            loginSuccess: false
        }
    }

    btToggle = () => {
        this.setState({modalOpen: !this.state.modalOpen})
    }

    handleChange = (property, value) => {
        console.log(property, value)
        this.setState({ [property]: value})
    }

    btLogin = () => {
        let { username, password } = this.state
        // let username = this.username.value
        // let password = this.password.value

        if (username === '' || password === '') {
            this.setState({
                alertIsOpen: !this.state.alertIsOpen, 
                alertColor: "warning", 
                alertMessage: "Form cannot be Empty"
            })
            
        } else {
            let query = username.includes('@') && username.includes('.') ? `email` : `username`;
            this.props.Login(query, username, password)
            // Axios.get(API_URL + query + `&password=${password}`)
            // .then((res) => {
            //     console.log('POST Login', res.data)
            //     localStorage.setItem("id", res.data[0].id)
            //     // this.setState({
            //     //     alertIsOpen: true, 
            //     //     alertColor: "success", 
            //     //     alertMessage: "Login Successful",
            //     //     loginSuccess: true
            //     // })
            //     this.props.login(res.data[0])
            // })
            // .catch((err) => {
            //     console.log('ERR post Register', err)
            //     this.setState({
            //         alertIsOpen: true,
            //         alertColor: "danger", 
            //         alertMessage: "Wrong Email or Password"
            //     })
            // })
        }
    }

    render() { 
        if(this.state.alertIsOpen) {
            setTimeout(() => this.setState({
                alertIsOpen: !this.state.alertIsOpen, 
                modalOpen: this.state.regisSuccess ? !this.state.modalOpen : true
            }), 
            2000)
            return <Redirect to="/" />
        }

        return (  
            <>
                <Button color="primary" onClick={this.btToggle}>Login</Button>
                <Modal isOpen={this.state.modalOpen}>
                    <ModalHeader>Login</ModalHeader>
                        <ModalBody>
                            <Alert color={this.state.alertColor} isOpen={this.state.alertIsOpen}>
                                {this.state.alertMessage}
                            </Alert>
                            <Input type="text" className="my-3" placeholder="Username/Email" onChange={e => this.handleChange("username", e.target.value)} />
                            <Input type="password" className="my-3" placeholder="Password" onChange={event => this.handleChange("password", event.target.value)} />
                            {/* <Form>
                                <Alert isOpen={this.state.alertIsOpen} color={this.state.alertColor} toggle={() => this.setState({alertIsOpen: false})}>{this.state.alertMessage}</Alert>
                                <FormGroup>
                                    <Label>Username/Email</Label>
                                    <Input type="text" innerRef={(apaAja) => this.username = apaAja}></Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Password</Label>
                                    <Input type="password" innerRef={(apaAja) => this.password = apaAja}></Input>
                                </FormGroup>
                            </Form> */}
                        </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.btLogin}>Login</Button>
                        <Button color="secondary" onClick={this.btToggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>

            </>
        );
    }
}
 
export default connect(null, { login, Login })(SignInModal);