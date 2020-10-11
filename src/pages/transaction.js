import Axios from 'axios';
import React from 'react';
import { Button, Card, Table, UncontrolledCollapse } from 'reactstrap';
import Swal from 'sweetalert2';
import { API_URL } from '../support/url';

class TransactionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            dbTransactions: [],
        }
    }
    
    componentDidMount() {
        this.getTransaction()
    }

    getTransaction = () => {
        Axios.get(API_URL + `/userTransactions?iduser=${localStorage.getItem("id")}`)
            .then((res) => {
                console.log("userTransaction", res.data)
                this.setState({ dbTransactions: res.data })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderDetail = (index) => {
        return this.state.dbTransactions[index].cart.map((item, index) =>{
            return (
                    <tr key={index}>
                        <th>{index + 1}</th>
                        <td><img src={item.images} alt={item.category} height="100px"  /></td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.size}</td>
                        <td>{item.qty}</td>
                        <td>{item.price.toLocaleString()}</td>
                        <td>{item.totalPrice.toLocaleString()}</td>
                    </tr>
            )
        })
    }

    totalPayment = (index) => {
        let payment = 0
        this.state.dbTransactions[index].cart.forEach( element => {
            payment += element.totalPrice
        })
        return payment.toLocaleString()
    }

    renderTransactions = () => {
        return this.state.dbTransactions.map((item, index) => {
            return (
                <>
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.date}</td>
                    <td>{item.username}</td>
                    <td>{item.status}</td>
                    <td>
                        <Button style={{marginRight: 10}} id={`page${index}`} color="info" >Detail</Button> 
                        <Button color="primary" onClick={() => this.btPayment(item.id)}>Payment</Button>
                    </td>
                    </tr>
                    <tr>
                    <UncontrolledCollapse toggler={`#page${index}`}>
                        <Card key={index}>
                            <Table>
                                <thead>
                                    <th>No.</th>
                                    <th>Product</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Size</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Amount Price</th>
                                </thead>
                                <tbody>
                                    {this.renderDetail(index)}
                                </tbody>
                                <tfoot>
                                    <th colspan="7" >Total Payment</th>
                                    <th>IDR. {this.totalPayment(index)}</th>
                                </tfoot>
                            </Table>
                        </Card>
                    </UncontrolledCollapse>
                </tr>
            </>
            )
        })
    }
    
    btPayment = (id) => {
        Axios.patch(API_URL + `/userTransactions/${id}`, {status: "Paid"})
            .then((res) => {
                console.log("Paid Success", res.data)
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Product Successfully Updated'
                })
                this.getTransaction()
            })
            .catch((err) => {
                console.log(err)
            })
    }
    
    render() { 
        return (  
            <div className="container">
                <Table hover>
                    <thead>
                       <th>No</th>
                       <th>Date</th>
                       <th>Username</th>
                       <th>Status</th>
                       <th>Action</th>
                    </thead>
                    <tbody>
                        {this.renderTransactions()}
                    </tbody>
                </Table>
            </div>
        );
    }
}
 
export default TransactionPage;