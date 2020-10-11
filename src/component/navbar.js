import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Badge, Card, CardImg, CardText, CardSubtitle } from 'reactstrap';
import SignInModal from './signinModal';
import { connect } from 'react-redux';
import { logout } from '../redux/actions'
// import { API_URL } from "../support/url";
// import Axios from "axios";



class NavbarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            collapsed: false,
            // dataUser: {},
            dropOpen: false,
            cartOpen: false,
         }
    }

    // keepLogin = () => {
    //     let id = localStorage.getItem("id");
    //     if (id) {
    //       Axios.get(API_URL + `/users?id=${id}`)
    //         .then((res) => {
    //           console.log("SUCCESS KeepLogin: ", res.data);
    //           this.setState({ dataUser: res.data[0] });
    //           console.log("cek datauser: ", this.state.dataUser);
    //         })
    //         .catch((err) => {
    //           console.log("ERR keepLogin: ", err);
    //         });
    //     }
    // };
    
    // componentDidMount() {
    // this.keepLogin();
    // }

    btLogout = () => {
        localStorage.removeItem("id");
        this.props.logout()
        // this.setState({redirectStatus: true})
    }

    getQty = () => {
        let qtyCart = 0
        this.props.user.cart.forEach((item, index) => {
            qtyCart += item.qty
        })
        return qtyCart
    }

    getUnique = () => {
        return this.props.user.cart.length
    }

    renderCart = () => {
        return this.props.cart.map((item, index) => {
            return (
                // <Card key={index}>
                //     <div className="row">
                //         <CardImg className="col-4" height="50px" src={item.images} lat={item.category} />

                //     </div>
                //     <div className="col-8">
                //         <CardSubtitle>{item.name}</CardSubtitle>
                //         <CardSubtitle>Size: {item.size}</CardSubtitle>
                //         <CardSubtitle>Qty: {item.qty}</CardSubtitle>
                //         <CardSubtitle>Rp. {item.totalPrice.toLocaleString()}</CardSubtitle>

                //     </div>
                // </Card>
                <div className="row">
                    <div className="col-4">
                        <img height="50px" src={item.images} alt={item.category} />
                    </div>
                    <div className="col-8">
                        <p>{item.name}</p>
                        <p>Size: {item.size}</p>
                        <p>Qty: {item.qty}</p>
                        <p>Rp. {item.totalPrice.toLocaleString()}</p>
                   </div>
                </div>
            )
        })
    }


    render() { 
        let { user } = this.props
        // karena redirect di navbar yg notabene selalu ada, ada perlakuan KHUSUS
        
        // bisa juga cara ini:
        // if (!localStorage.getItem("id")) {
        // if (this.state.redirectStatus) {
        //     return <Redirect to="/" />
        // }

        return (  
            <div>
                <Navbar color="faded" light expand="md">
                    <NavbarBrand>
                        <Link to='/' className="nav-link">
                            <img src={require('../assets/images/logoA.png')} width="50px" alt="brand" />
                        </Link>
                    </NavbarBrand>
                    <NavbarToggler onClick={() => this.setState({collapsed: !this.state.collapsed})} className="mr-2" />
                    <Collapse isOpen={this.state.collapsed} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <Link to='/product' className="nav-link">Product</Link>
                            </NavItem>
                            <NavItem>
                                <Link to='/about' className="nav-link">About</Link>
                            </NavItem>
                            {
                                user.role && user.role==="admin" ?
                                <>
                                    <NavItem>
                                        <Link to='/product-admin' className="nav-link">PM</Link>
                                    </NavItem>
                                    <NavItem>
                                        <Link to='/carousel-admin' className="nav-link">CM</Link>
                                    </NavItem>
                                </>
                                :
                                null
                            }
                            <div style={{marginLeft: '70vw'}}>
                                {
                                    user.id ?
                                        user.role==="user" ?
                                        <div className="d-flex">
                                        <Dropdown direction="left" isOpen={this.state.cartOpen} toggle={() => this.setState({ cartOpen: !this.state.cartOpen })}>
                                            <DropdownToggle caret>
                                                🛒 <Badge color="danger">{this.getUnique()}</Badge>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {this.renderCart()}
                                                <DropdownItem divider/>
                                                <DropdownItem>
                                                    <Link to='/cart'>
                                                        Go To Cart 
                                                    </Link>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        <Dropdown isOpen={this.state.dropOpen} toggle={() => this.setState({ dropOpen: !this.state.dropOpen })}>
                                            <DropdownToggle caret>
                                                {user.username}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Profile</DropdownItem>
                                                <DropdownItem>
                                                    <Link to='/cart'>
                                                        Cart <Badge color="danger">{this.getQty()}</Badge>
                                                    </Link>
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <Link to='/transaction'>
                                                        Transaction
                                                    </Link>
                                                </DropdownItem>
                                                <DropdownItem onClick={this.btLogout}>Log Out</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        </div>
                                        :
                                        <Dropdown direction="left" isOpen={this.state.dropOpen} toggle={() => this.setState({ dropOpen: !this.state.dropOpen })}>
                                            <DropdownToggle caret>
                                                {user.username}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>
                                                    <Link to='/product-admin' className="nav-link">Product Management</Link>
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <Link to='/transaction-admin' className="nav-link">Transaction Management</Link>
                                                </DropdownItem>
                                                <DropdownItem>
                                                    <Link to='/carousel-admin' className="nav-link">Slide Management</Link>
                                                </DropdownItem>
                                                <DropdownItem divider />
                                                <DropdownItem onClick={this.btLogout} style={{color: "red"}}>Log Out</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    :
                                    <>
                                        <SignInModal/>
                                        <Button color="secondary" size="small">
                                            <Link to={{pathname: '/register'}} style={{textDecoration: "none", color: "white"}}>
                                                Register
                                            </Link>
                                        </Button>
                                    </>
                                }
                                {/* {
                                    localStorage.getItem("id") > 0
                                    ?
                                    <Dropdown isOpen={this.state.dropOpen} toggle={() => this.setState({ dropOpen: !this.state.dropOpen })}>
                                        <DropdownToggle>
                                            {this.state.dataUser.username}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Profile</DropdownItem>
                                            <DropdownItem onClick={this.btLogout}>Log Out</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    :
                                    <>
                                        <SignInModal keep={this.keepLogin} />
                                        <Button color="secondary" size="small">
                                            <Link to='/register'style={{textDecoration: "none", color: "white"}}>
                                                Register
                                            </Link>
                                        </Button>
                                    </>
                                } */}
                            </div>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("cekDataCart", state.authReducer)
    return {
        user: state.authReducer,
        cart: state.authReducer.cart,
        id: state.authReducer.id,
        product: state.productReducers
    }
}

 
export default connect(mapStateToProps, {logout})(NavbarComponent);