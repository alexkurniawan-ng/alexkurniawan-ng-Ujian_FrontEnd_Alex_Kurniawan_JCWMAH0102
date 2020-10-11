import Axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Table } from 'reactstrap';
import AddProduct from '../component/addProduct';
import EditProduct from '../component/editProduct';
import { API_URL } from '../support/url';
import { connect } from 'react-redux';
import { getProducts } from '../redux/actions'

class ProductManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            // dbProducts: [],
            selectedIdx: null,
            editOpen: false,
            total: 0,
            sortProduct: "default",
            isOpen: "false",
        }
    }

    // componentDidMount() {
    //     this.getProducts()
    // }

    // getProducts = () => {
    //     Axios.get(API_URL + '/products')
    //     .then((res) => {
    //         console.log("GET products", res.data)
    //         this.setState({dbProducts: res.data})
    //     })
    //     .catch((err) => {
    //         console.log("ERR getProduct", err)
    //     })
    // }

    renderStock = (stock) => {
        return stock.map((item, index) => {
            return (
                <h6 key={index}><Badge color="primary">size {item.code} | stock : {item.total}</Badge></h6>
            )
        })
    }

    btDelete = (id) => {
        console.log("CEK btDelete id:", id)
        Axios.delete(API_URL + `/products/${id}`)
        .then((res) => {
            console.log("DELETE btDelete: ", res.data)
            this.getProducts()
        })
        .catch((err) => {
            console.log("ERR btDelete: ", err)
        })
    }

    renderProducts = (params) => {
        let products = [...this.props.products]
        console.log("cek variable products", products)

        let temp = 0
        for (let i = 0; i < products.length; i++) {
            for (let j = 0; j < products[i].stock.length; j++) {
                temp += products[i].stock[j].total
            }
            products[i].totalStock = temp
            temp = 0
        }
        console.log("after forloops", products)

        if (params === "asc") {
            products.sort((a, b) => (a.name > b.name && 1) || (a.name === b.name ? 0 : -1))
            // console.log("product sort asc", products)
        } else if ( params === "desc") {
            products.sort((a, b) => (a.name < b.name && 1) || (a.name === b.name ? 0 : -1))
        } else if ( params === "stockAsc") {
            products.sort((a, b) => (a.totalStock > b.totalStock && 1) || (a.totalStock === b.totalStock ? 0 : -1))
        } else if ( params === "stockDesc") {
            products.sort((a, b) => (a.totalStock < b.totalStock && 1) || (a.totalStock === b.totalStock ? 0 : -1))
        } else if ( params === "priceAsc") {
            products.sort((a, b) => (a.price > b.price && 1) || (a.price === b.price ? 0 : -1))
        } else if ( params === "priceDesc") {
            products.sort((a, b) => (a.price < b.price && 1) || (a.price === b.price ? 0 : -1))
        }

        return products.map((item, index) => {
                return (
                    <tr key={index}>
                        <th>{index + 1}</th>
                        <td>
                            <Link to={`/product-detail?id=${item.id}`}>
                                <img src={item.images[0]} height="200px" />
                            </Link>
                        </td>
                        <td>
                            <Link to={`/product-detail?id=${item.id}`}>
                                {item.name}
                            </Link>
                        </td>
                        <td>{item.brand}</td>
                        <td>{item.category}</td>
                        <td>{item.colour.toLowerCase()}</td>
                        <td className="text-justify font-italic">{item.description.slice(0,80)}<span className="text-muted">[...]</span></td>
                        <td>
                            {this.renderStock(item.stock)} 
                            <Badge color="danger">Total Stock : {item.totalStock}</Badge>                            
                        </td>
                        <td>IDR. {item.price.toLocaleString()}</td>
                        <td>
                            <Button color="warning" 
                                onClick={() => this.setState({editOpen:!this.state.editOpen, selectedIdx: index})
                                }>Edit</Button>
                            <Button color="danger" onClick={() => this.btDelete(item.id)}>Delete</Button>
                        </td>
                    </tr>
                )
        })
    }

    render() { 
        return (  
            <div className="container">
                <h3 className="text-center my-3">Products Management</h3>
                <Dropdown direction="right" isOpen={!this.state.isOpen} toggle={() => this.setState({isOpen: !this.state.isOpen})} >
                    <DropdownToggle caret>
                        Sort by
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => {this.setState({sortProduct: "default"})}}>Default</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => {this.setState({sortProduct: "asc"})}}>Ascending</DropdownItem>
                        <DropdownItem onClick={() => {this.setState({sortProduct: "desc"})}}>Descending</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => {this.setState({sortProduct: "stockAsc"})}}>Smallest Amount Stock</DropdownItem>
                        <DropdownItem onClick={() => {this.setState({sortProduct: "stockDesc"})}}>Largest Amount Stock</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem onClick={() => {this.setState({sortProduct: "priceAsc"})}}>Cheapest</DropdownItem>
                        <DropdownItem onClick={() => {this.setState({sortProduct: "priceDesc"})}}>Expensive</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <AddProduct getProduct={this.getProducts} />
                <Table hover>
                    <thead>
                        <th>No.</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Colour</th>
                        <th>Description</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {this.renderProducts(this.state.sortProduct)}
                    </tbody>
                </Table>
                {
                    this.state.selectedIdx !== null 
                    && 
                    <EditProduct 
                        editOpen = {this.state.editOpen}
                        editClose = {() => this.setState({editOpen: !this.state.editOpen, selectedIdx: null})} 
                        selectedIdx = {this.state.selectedIdx} 
                        data = {this.props.products[this.state.selectedIdx]}
                        getProducts = {this.getProducts}
                    />
                }
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

export default connect(mapStateToProps, {getProducts})(ProductManagement);