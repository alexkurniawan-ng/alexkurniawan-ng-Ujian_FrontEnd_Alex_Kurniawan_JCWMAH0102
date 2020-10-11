import Axios from 'axios';
import React from 'react';
import { connect } from 'react-redux'
import { Button, Table } from 'reactstrap';
import { API_URL } from '../support/url';
import { login, KeepLogin } from '../redux/actions'
import { Redirect } from 'react-router-dom';


class CartPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            selectedIdx: null
        }
    }

    refreshCart = () => {
        Axios.patch(API_URL + `/users/${this.props.id}`, { cart: this.props.cart})
            .then((res) => {
                console.log("SUCCESS Refresh", res.data)
                localStorage.setItem("id", res.data.id)
                this.props.login(res.data)
            })
            .catch((err) => {
                console.log("ERR Refresh", err)
            })
    }

    btIncrement = (index) => {
        this.props.cart[index].qty += 1
        this.props.cart[index].totalPrice = this.props.cart[index].price * this.props.cart[index].qty
        console.log(this.props.cart[index].qty)
        this.refreshCart()
    }
    
    btDecrement = (index) => {
        this.props.cart[index].qty -= 1
        this.props.cart[index].totalPrice = this.props.cart[index].price * this.props.cart[index].qty
        console.log(this.props.cart[index].qty)
        this.refreshCart()
    }

    renderCart = () => {
        return this.props.cart.map((item, index) => {
            return (
                <tr key={index}>
                    <th>{index + 1}</th>
                    <td><img src={item.images} alt={item.category} height="100px"  /></td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.size}</td>
                    <div className="d-flex">
                        <Button onClick={() => this.btDecrement(index)}>-</Button> 
                            &nbsp;
                            <p>{item.qty}</p>
                            &nbsp;
                        <Button onClick={() => this.btIncrement(index)}>+</Button>
                    </div>
                    <td>{item.price.toLocaleString()}</td>
                    <td>{item.totalPrice.toLocaleString()}</td>
                    <th>
                        <Button color="danger" onClick={() => this.btDelete(index)}>Delete</Button>
                    </th>
                </tr>
            )
        })
    }

    btDelete = (index) => {
        this.props.cart.splice(index, 1)
        this.refreshCart()
    }

    totalPayment = () => {
        let payment = 0
        this.props.cart.forEach( element => {
            payment += element.totalPrice
        })
        return payment.toLocaleString()
    }

    decrementStock = (id, stock) => {
        Axios.patch(API_URL + `/products/${id}`, stock)
            .then((res) => {
                console.log("decrementStock Success", res.data)
            })
            .catch((err) => {
                console.log("decrementStock Error", err)
            })
    }

    btCheckout = () => {
        let date = new Date()
        let obj = {
            iduser : this.props.id,
            username : this.props.user.username,
            date : date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(),
            cart: this.props.cart,
            status: "Unpaid"
        }
        console.log("cek OBJ", obj)

        // Melakukan looping untuk menemukan id product yang ada di cart dengan yang ada di database product
        this.props.cart.forEach((item, index) => {
            // Looping database product

            // Cara 1
            // this.props.product.forEach((value, idx) => {
            //     // memberikan fungsi condition dari cart(item.idProduct) dengan product(value.id)
            //     if (item.idProduct === value.id) {
            //         console.log("sama", item.idProduct, value.id)
            //         let indexStock = value.stock.findIndex(element => element.code == item.size)
            //         console.log(value.stock[indexStock])
            //         value.stock[indexStock].total -= item.qty
            //         this.decrementStock(value.id, {stock: value.stock})
            //     }
            // })

            // Cara 2
            // Mencari index product
            let indexProduct = this.props.product.findIndex(value => value.id === item.idProduct)
            // Mencari index stock
            let indexStock = this.props.product[indexProduct].stock.findIndex(value => value.code === item.size)
            this.props.product[indexProduct].stock[indexStock].total -= item.qty
            this.decrementStock(item.idProduct, {stock: this.props.product[indexProduct].stock})

        })


        Axios.post(API_URL + '/userTransactions', obj)
            .then((res) => {
                console.log("Checkout Success")
                Axios.patch(API_URL + `/users/${this.props.id}`, {cart: []})
                    .then((res) => {
                        console.log("success checkout", res.data)
                        this.setState({ redirectStatus: true})
                        this.props.KeepLogin()
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log("Checkout Error")
            })
    }


    render() { 
        if (this.state.redirectStatus) {
            return <Redirect to="/transaction" />
        }
        
        return (  
            <div className="container">
                <Table hover>
                    <thead>
                        <th>No.</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Size</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total Price</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {this.renderCart()}
                    </tbody>
                    <tfoot>
                        <th colspan="7" >Total Payment</th>
                        <th>IDR. {this.totalPayment()}</th>
                        <td><Button color="success" onClick={() => this.btCheckout()}>Checkout</Button></td>
                    </tfoot>
                </Table>
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

// Jika hanya ingin mengambil data dari global store / reducer => mapStateToProps
// Jika hanya meletakkan / menyimpan ke Reducer / global store, maka yg connect hanya ACTION (diimport dulu fungsinya), state HARUS dikosongkan (null) => connect(null, {fungsi}{CARTPAGE})
// Jika butuh keduanya, makanya diisi keduanya seperti dibawah ini
// kedua parameter connect tidak harus berhubungan, pakai yg dibutuhkan saja (mapstatetoprops vs {login})
export default connect(mapStateToProps, { login, KeepLogin })(CartPage);