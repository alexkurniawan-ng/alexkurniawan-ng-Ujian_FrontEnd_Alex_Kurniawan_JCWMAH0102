import React from 'react';
import { Button, Form, FormFeedback, FormGroup, FormText, Input, Jumbotron, Label, Progress } from 'reactstrap';
import { API_URL } from '../support/url';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { Redirect } from 'react-router-dom'

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            username: '',
            email: '',
            password: '',
            confPassword: '',
            userValid: false,
            userInvalid: false,
            emailValid: false,
            passValue: 0,
            passLvl: '',
            passNotif: '',
            userMessage: 'Username Invalid',
            emailMessage: 'Email Invalid'
        }
    }

    handleChange = (property, value) => {
        // String validation with regex
        // let abjad = /[a-zA-Z0-9]/
        // i untuk huruf termasuk uppercase
        let abjad = /[a-z]/i
        let numb = /[0-9]/
        let symbol = /[!@#$%^&*():;]/
        let domain = /(.id|.com|.org|.co.id|.edu|.tech)/
        console.log(property, abjad.test(value))

        // console.log(property, value)
        // Membuat properti objek menggunakan string, ["namaProperty"]
        this.setState({ [property]: value})

        if (property === "username") {
            // username harus terdiri dari abjad dan angka
            this.setState({
                userValid: abjad.test(value) && numb.test(value) ? true : false,
                userInvalid: abjad.test(value) && numb.test(value) ? false : true
            })
            // Mengecek username apakah ada yg sama di server di setiap input form diisi
            Axios.get(API_URL + `/users?username=${value}`)
            .then((res) => {
                if(res.data.length > 0) {
                    this.setState({userMessage: "Username already Exist", userValid: false})
                } else {
                    this.setState({userMessage: "Username Invalid"})
                }
            })
            .catch((err) => {
                console.log(err)
            })
        } else if (property === "email") {
            // username harus terdiri dari abjad dan angka
            this.setState({
                emailValid: abjad.test(value) && domain.test(value) && value.includes('@') ? true : false,
            })
            // Mengecek email apakah ada yg sama di server di setiap input form diisi
            Axios.get(API_URL + `/users?email=${value}`)
            .then((res) => {
                if(res.data.length > 0) {
                    this.setState({emailMessage: "Email already Exist", emailValid: false})
                    console.log("cek email exist")
                } else {
                    this.setState({emailMessage: "Email Invalid"})
                }
            })
            .catch((err) => {
                console.log(err)
            })
        } else if (property === "password") {
            if (abjad.test(value) && !numb.test(value) && !symbol.test(value) && value.length > 3) {
                this.setState({passValue: 30, passLvl: "Weak", passNotif: "danger"})
            } else if (abjad.test(value) && numb.test(value) && !symbol.test(value) && value.length > 3) {
                this.setState({passValue: 50, passLvl: "Medium", passNotif: "warning"})
            } else if (abjad.test(value) && !numb.test(value) && symbol.test(value) && value.length > 3) {
                this.setState({passValue: 50, passLvl: "Medium", passNotif: "warning"})
            } else if (abjad.test(value) && numb.test(value) && symbol.test(value) && value.length > 7) {
                this.setState({passValue: 100, passLvl: "Strong", passNotif: "success"})
            } else if (abjad.test(value) && numb.test(value) && symbol.test(value) && value.length > 5) {
                this.setState({passValue: 80, passLvl: "Strong", passNotif: "success"})
            } else if (!abjad.test(value) && !numb.test(value) && symbol.test(value) && value.length > 3) {
                this.setState({passValue: 30, passLvl: "Weak", passNotif: "danger"})
            } else if (!abjad.test(value) && numb.test(value) && !symbol.test(value) && value.length > 3) {
                this.setState({passValue: 30, passLvl: "Weak", passNotif: "danger"})
            } else {
                this.setState({passValue: 0, passLvl: "", passNotif: ""})
            }
        }
    }

    // onChange versi normal
    // handleChange = (event) => {
        // console.log(event.target.value)
        // this.setState({username: event.target.value})
    // }

    btRegister = () => {
        // -Get Data menggunakan innerRef-
        // let username = this.username.value
        // let email = this.email.value
        // let phone = this.phone.value
        // let password = this.password.value
        // let confPassword = this.confPassword.value

        // Data dari state
        let {username, email, phone, password, confPassword, userValid, emailValid} = this.state

        // console.log("cek input", username, email, phone, password, confPassword)
        if (username === '' || email === '' || phone === '' || password === '' || confPassword === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Fill in the form'
            })
        } else {
            if (password === confPassword && userValid && emailValid) {
                Axios.get(API_URL + `/users?username=${username}`)
                .then((res) => {
                    console.log('cek search username: ', res.data)
                    if (res.data.length === 0) {
                        Axios.post(API_URL + '/users', {username, email, phone, password, role: "user", cart: []})
                        .then((res) => {
                            console.log("RES btRegister: ", res.data)
                            this.setState({ redirect: true })
                            Swal.fire({
                                icon: 'success',
                                title: 'Congratulations',
                                text: 'Register Success'
                            })
                            // Axios.get(API_URL + `/users?id=${res.data.id}`)
                            // .then((res) => {
                            //     localStorage.setItem("id", res.data[0].id)
                            // })
                            // .catch((err) => {
                            //     console.log("error login dari regiterpage: ", err)
                            // })
                        })
                        .catch((err) => {
                            console.log("ERR btRegister: ", err)
                        })
        
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oppsss',
                            text: 'User already Exist'
                        })
                    }
                })
                .catch((err) => {
                    console.log("ERR get search username", err)
                })

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Your Password not Match'
                })
            }
        }


    }

    render() { 
        if(this.state.redirect) {
            return <Redirect to='/'  />
        }

        // console.log('username', this.state.username)
        return (  
            <div className="container">
                <Jumbotron className="my-5" style={{backgroundColor:"#404146"}}>
                    <div className="row">
                        <div className="col-12 col-sm-7">
                            <img src={require('../assets/images/logoBwhite.png')} alt="logo" width="100%" style={{margin: '10% auto'}} />
                            <hr style={{backgroundColor: 'white'}} />
                        </div>
                        <div className="col-12 col-sm-5">
                            <Form>
                                <FormGroup>
                                    <Label className="text-white">Username</Label>
                                    <Input type="text" innerRef={(item) => this.username = item} onChange={(event) => this.handleChange('username', event.target.value)} valid={this.state.userValid} invalid={this.state.username.length > 0 && !this.state.userValid}/>
                                    <FormFeedback valid>Username Valid</FormFeedback>
                                    <FormFeedback>{this.state.userMessage}</FormFeedback>
                                    <FormText color="white">Username must contains alphabet and number</FormText>
                                </FormGroup>
                                <FormGroup>
                                    <Label className="text-white">Email</Label>
                                    <Input type="text" innerRef={(apaaja) => this.email = apaaja} onChange={(e) => this.handleChange('email', e.target.value)} valid={this.state.emailValid} invalid={!this.state.emailValid}/>
                                    <FormFeedback valid>Email Format Valid</FormFeedback>
                                    <FormFeedback>{this.state.emailMessage}</FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label className="text-white">Phone</Label>
                                    <Input type="text" innerRef={(terserah) => this.phone = terserah} onChange={(e) => this.handleChange('phone', e.target.value)} />
                                </FormGroup>
                                <FormGroup>
                                    <Label className="text-white">Password</Label>
                                    <Input type="password" placeholder="Min. 6 Char (abjad, number, symbol)" innerRef={(value) => this.password = value} onChange={(event) => this.handleChange('password', event.target.value)} />
                                    {   
                                        //ternary tidak perlu : null
                                        this.state.password.length > 3 &&
                                        <Progress value={this.state.passValue} color={this.state.passNotif}>{this.state.passLvl}</Progress>
                                    }
                                </FormGroup>
                                <FormGroup>
                                    <Label className="text-white">Confirm Password</Label>
                                    <Input type="password" innerRef={(value) => this.confPassword = value} onChange={e => this.handleChange('confPassword', e.target.value)} />
                                </FormGroup>
                            </Form>
                            <Button outline color="info" onClick={this.btRegister} >Register</Button>
                        </div>
                    </div>
                </Jumbotron>
            </div>
        );
    }
}
 
export default RegisterPage;