import Axios from 'axios';
import React from 'react';
import { Button, ButtonGroup, Input, Jumbotron } from 'reactstrap';
import { API_URL } from '../support/url';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            detail: {},
            thumbnail: 0,
            total: 0,
            size: '',
            qty: 0,
            hargaTotal: 0,
        }
    }

    componentDidMount() {
        this.getProductDetail()
    }

    getProductDetail = () => {
        // mendapatkan id product
        console.log(this.props.location.search)

        Axios.get(API_URL + `/products${this.props.location.search}`)
        .then((res) => {
            console.log("GET productDetail: ", res.data)
            this.setState({detail: res.data[0]})
        })
        .catch((err) => {
            console.log("ERR getProductDetail: ", err)
        })
    }

    renderThumbnail = (images) => {
        return images.map((item, index) => {
            return (
                <div className="flex-grow-1 select-image" onClick={() => {this.setState({thumbnail:index})}} style={{padding:"0 1px"}}>
                    <img src={item} key={index} width="100%" />
                </div> 
            )
        })
    }

    renderStock = (stock) => {
        return stock.map((item, index) => {
            return (
                // item.total > 0 ?
                // &&
                <Button disabled={item.total === 0 && true} onClick={() => this.setState({ total: item.total, size: item.code})} key={index}>{item.code}</Button>
            )
        })
    }

    btIncrement = () => {
        // note : masih kurang sempurna jika sudah terlanjur > stock
        if(this.state.qty < this.state.total) {
            this.setState({ qty: this.state.qty += 1})
        } else {
            alert("out of stock")
        }
    }

    btAddToCart = () => {
        console.log("Add to Cart", this.state.detail.id, this.state.detail.price, this.state.qty)
        let idProduct = this.state.detail.id
        let name = this.state.detail.name
        let images = this.state.detail.images[0]
        let category = this.state.detail.category
        let size = this.state.size
        let price = parseInt(this.state.detail.price)
        let qty = this.state.qty
        let totalPrice = qty * price
        let userID = localStorage.getItem("id")


        this.state.detail.forEach((item, index) => {
            this.props.product.forEach((value, idx) => {
                if (item.idProduct === value.id) {

                console.log("sama", item.idProduct, value.id)
                // let indexStock = value.stock.findIndex(element => element.code == item.size)
                // console.log(value.stock[indexStock])
                // value.stock[indexStock].total -= item.qty
                // this.decrementStock(value.id, {stock: value.stock})
                }
            })
        })
        
        
        this.props.cart.push({
            idProduct: idProduct,
            name: name, 
            images: images, 
            category: category, 
            size: size, 
            price: price, 
            qty: qty, 
            totalPrice: totalPrice
        })


        Axios.patch(API_URL + `/users/${userID}`, {cart: this.props.cart})
            .then((res) => {
                console.log("SUCCESS addtoCart: ", res.data)
                this.setState({ redirectStatus: true })
            })
            .catch((err) => {
                console.log("ERR addtoCart: ", err)
            })
    
        }

    

    render() { 
        let { detail, thumbnail } = this.state
        if (this.state.redirectStatus) {
           return <Redirect to="/cart" />
        }
        return (
            <div className="container">
                {
                    detail.id &&
                    <Jumbotron className="row">
                        <div className="col-md-4">
                            <img src={detail.images[thumbnail]} width="100%" />
                            <div className="d-flex mt-1">
                                {this.renderThumbnail(detail.images)}
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="row mb-3">
                                <div className="col-md-7">
                                    <h3 className="font-italic" >{detail.name}</h3>
                                </div>
                                <div className="col-md-5">
                                    <h3 className="font-weight-bold">IDR. {parseInt(detail.price).toLocaleString()}</h3>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <h6 className="text-muted font-weight-bold">Brand</h6>
                                    <h5>{detail.brand}</h5>
                                </div>
                                <div className="col-md-3">
                                    <h6 className="text-muted font-weight-bold">Category</h6>
                                    <h5>{detail.category}</h5>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="text-muted font-weight-bold">Colour</h6>
                                    <h5>{detail.colour}</h5>
                                </div>
                            </div>
                            <p className="text-justify">{detail.description}</p>
                            <div className="text-center">
                                <ButtonGroup>
                                    {this.renderStock(detail.stock)}
                                </ButtonGroup>
                                {
                                    this.state.total !== 0 ?
                                    this.state.total <=1 ?
                                    <p style={{color: "red"}}>Last Stock!</p>
                                    :
                                    <p>Stock Available: {this.state.total}</p>
                                    :
                                    <p className="text-muted">click size to display stock</p>
                                }
                            </div>
                            <div className="d-flex justify-content-center">
                                {/* <Button outline color="primary" onClick={() => this.setState({qty: this.state.qty - 1})}>-</Button>
                                <Input className="text-center" value={this.state.qty} style={{width: "50px"}} />
                                <Button outline color="primary" onClick={() => this.setState({qty: this.state.qty + 1})}>+</Button> */}
                                <Button outline color="primary" onClick={() => this.setState({qty: this.state.qty > 0 ? this.state.qty -= 1 : 0})}>-</Button>
                                <Input className="text-center" value={this.state.qty} style={{width: "50px"}} />
                                <Button outline color="primary" onClick={this.btIncrement}>+</Button>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                <h4>IDR: {(this.state.qty * detail.price).toLocaleString()}</h4>
                                </div>
                                <div className="col-md-4">
                                    <Button color="success" style={{float: "right"}} onClick={this.btAddToCart}>Add to Cart</Button>
                                </div>
                            </div>
                        </div>
                    </Jumbotron>
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("Cek Data", state.authReducer)
    return {
        cart : state.authReducer.cart,
        product: state.productReducers
    }
}
 
export default connect(mapStateToProps)(ProductDetail);