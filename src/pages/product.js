import Axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup } from 'reactstrap';
import { API_URL } from '../support/url';
import { connect } from 'react-redux';
import { getProducts } from '../redux/actions'

class ProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            isOpen: "false",
            sortProduct: "default",
            // dbProducts: [],
        }
    }

    componentDidMount() {
        this.getProducts()
    }

    getProducts = (tipe, order) => {
        
        let url = tipe ? order? `/products?_sort=${tipe}&_order=${order}` : `/products?category=${tipe}` : "/products"
        // console.log(sort1, sort2)
        Axios.get(API_URL + url)
            .then((res) => {
                console.log("GET Products: ", res.data)
                // this.setState({dbProducts: res.data})
                // this.renderProduct()
                this.props.getProducts(res.data)
            })
            .catch((err) => {
                console.log("ERR getProducts: ", err)
            })


        // if (this.state.sortProduct !== "default") {
        //     Axios.get(API_URL + `/products?category=${this.state.sortProduct}`)
        //     .then((res) => {
        //         console.log("GET Products: ", res.data)
        //         this.setState({getProducts: res.data})
        //     })
        //     .catch((err) => {
        //         console.log("ERR getProducts: ", err)
        //     })
        // }

        // else {

            // Axios.get(API_URL + '/products')
            // .then((res) => {
            //     console.log("GET Products: ", res.data)
            //     this.setState({dbProducts: res.data})
            // })
            // .catch((err) => {
            //     console.log("ERR getProducts: ", err)
            // })
        // // }
        
    }
    

    renderProduct = () => {
        console.log("cek variable products", this.state.dbProducts)
        console.log("cek state sortproduct", this.state.sortProduct)
        console.log(API_URL + `/products?_sort=id&_order=desc`)
        return this.props.products.map((item, index) => {
            return (
                <Col md="4" key={index} className="my-2">
                    <Card>
                        <Link to={`/product-detail?id=${item.id}`}>
                            <CardImg top width="25%" src={item.images[0]} />
                            <CardBody>
                                <CardTitle style={{height:"10vh"}}>{item.name}</CardTitle>
                                <CardText className="text-muted">Rp. {item.price.toLocaleString()},-</CardText>
                            </CardBody>
                        </Link>
                    </Card>
                </Col>
            )
        })
    }

    // Versi non Ujian

    // renderProduct = (params) => {
    //     let products = [...this.props.products]
    //     console.log("cek variable products", products)

    //     if (params === "asc") {
    //         products.sort((a, b) => (a.name > b.name && 1) || (a.name === b.name ? 0 : -1))
    //         // console.log("product sort asc", products)
    //     } else if ( params === "desc") {
    //         products.sort((a, b) => (a.name < b.name && 1) || (a.name === b.name ? 0 : -1))
    //     }

    //     return products.map((item, index) => {
    //         return (
    //             <Col md="4" key={index} className="my-2">
    //                 <Card>
    //                     <Link to={`/product-detail?id=${item.id}`}>
    //                         <CardImg top width="25%" src={item.images[0]} />
    //                         <CardBody>
    //                             <CardTitle style={{height:"10vh"}}>{item.name}</CardTitle>
    //                             <CardText className="text-muted">Rp. {item.price.toLocaleString()},-</CardText>
    //                         </CardBody>
    //                     </Link>
    //                 </Card>
    //             </Col>
    //         )
    //     })
    // }

    btSort = () => {
        let sort1 = this.sort1.value
        let sort2 = this.sort2.value

        console.log(sort1, sort2)
        Axios.get(API_URL + `/products?_sort=id&_order=desc`)
            .then((res) => {
                console.log("GET Products: ", res.data)
                this.setState({dbProducts: res.data})
                this.renderProduct()
            })
            .catch((err) => {
                console.log("ERR getProducts: ", err)
            })

    }

    render() { 
        return (  
            <div className="container">
                <div className="d-flex">
                    <Button color="primary" onClick={() => this.getProducts()}>All Product</Button>
                    <Dropdown isOpen={!this.state.isOpen} toggle={() => this.setState({isOpen: !this.state.isOpen})} >
                        <DropdownToggle color="primary" caret />
                        <DropdownMenu>
                            <DropdownItem onClick={() => this.getProducts("Shoes")}>Shoes</DropdownItem>
                            <DropdownItem onClick={() => this.getProducts("Clothing")}>Clothing</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <div className="ml-5">
                        <InputGroup>
                            <Input type="select" innerRef={(value) => this.sort1 = value} >
                                <option>asc</option>
                                <option>desc</option>
                            </Input>
                            <Input type="select" innerRef={(value) => this.sort2 = value} >
                                <option>id</option>
                                <option>name</option>
                                <option>price</option>
                            </Input>
                            <Button onClick={() => this.getProducts(this.sort2.value, this.sort1.value)}>OK</Button>
                        </InputGroup>
                    </div>
                </div>
                {/* <Dropdown direction="right" isOpen={!this.state.isOpen} toggle={() => this.setState({isOpen: !this.state.isOpen})} >
                    <DropdownToggle caret>
                        Sort by
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => {this.setState({sortProduct: "default"})}}>Default</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => {this.setState({sortProduct: "asc"})}}>Ascending</DropdownItem>
                        <DropdownItem onClick={() => {this.setState({sortProduct: "desc"})}}>Descending</DropdownItem>
                    </DropdownMenu>
                </Dropdown> */}
                <div className="row">
                  {this.renderProduct()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({productReducers}) => {
    console.log("mapstate", productReducers)
    return {
        products: productReducers
    }
}

export default connect(mapStateToProps, {getProducts})(ProductPage);
