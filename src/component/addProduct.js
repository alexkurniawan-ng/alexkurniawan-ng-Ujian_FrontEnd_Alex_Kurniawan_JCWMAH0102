import Axios from 'axios';
import React from 'react';
import { Button, CustomInput, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Swal from 'sweetalert2';
import { API_URL } from '../support/url'

class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            modalOpen: false,
            name: '',
            image: '',
            brand: '',
            category: '',
            colour: '',
            description: '',
            price: 0,
            sizeShoes: [38, 39, 40, 41, 42],
            sizeClothing: ["S", "M", "L", "XL", "XXL"],
            listGambar: ["images1", "images2", "images3", "images4", "images5"]
        }
    }

    handleChange = (property, value) => {
        console.log(property, value)
        this.setState({ [property]: value})
    }

    btSubmit = () => {
        console.table(this.state)
        let stock = [], images = []
        let { name, brand, category, colour, description, price } = this.state
        
        if (name === '' || brand === '' || category === '' || colour === '' || description === '' || price === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Fill all Form',
                footer: '<a href>Why do I have this issue?</a>'
              })
        } else {
            this.state[`size${this.state.category}`].forEach((item, index) => {
                stock.push({code: item.toString(), total: this[`code${item}`].value === '' ? 0 : parseInt(this[`code${item}`].value) })
            })
    
            this.state.listGambar.forEach((item, index) => {
                if (this[item].value.length > 0) {
                    images.push(this[item].value)
                }
            })

            Axios.post(API_URL + '/products', {name, category, brand, colour, description, price, stock, images})
            .then((res) => {
                console.log("RES btSubmit Addproduct: ", res.data)
                this.props.getProduct()
                Swal.fire({
                    icon: 'success',
                    title: 'Congratulations',
                    text: 'Product Successfully Added'
                })
                this.setState({modalOpen: !this.state.modalOpen})
            })
            .catch((err) => {
                console.log("ERR Post AddProduct", err)
            })
        }
        

        console.table(stock)
        console.table(images)
    }

    renderInputStock = () => {
        // mengapa 2 return ? karena return dalam map untuk mengembalikan kedalam map (formgroup 28, formgroup 29) lalu return diluar untuk menggabungkan hasil map
        let { category } = this.state
        if ( category === "") {
            return <h5>Waiting Category</h5>
        } else {
            return this.state[`size${category}`].map((item, index) => {
                return (
                    <FormGroup key={index}>
                        <Label>{item}</Label>
                        <Input type="number" innerRef={(value) => this[`code${item}`] = value} />
                    </FormGroup>
                )
            })
        }
    }

    render() { 
        let {modalOpen} = this.state
        return (  
            <div style={{float: "right", marginRight:"2vw"}}>
                <Button color="info" onClick={() => this.setState({modalOpen: !modalOpen})} toggle>Add Product</Button>
                <Modal isOpen={modalOpen}>
                    <ModalHeader>Add Product</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label>Name</Label>
                            <Input type="text" onChange={event => {this.handleChange("name", event.target.value)}} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Image</Label>
                            <div className="d-flex flex-wrap">
                                {
                                    this.state.listGambar.map((item, index) => {
                                        return <Input style={{width: "30%"}} placeholder={`Images ${index + 1}`} 
                                                type="text"  innerRef={value => this[item] = value} />
                                    })
                                }
                            </div>
                            {/* <Input type="text" onChange={event => {this.handleChange("image", event.target.value)}} /> */}
                        </FormGroup>
                        <FormGroup className="row">
                            <FormGroup className="col-4">
                                    <Label>Brand</Label>
                                    <Input type="text" onChange={event => {this.handleChange("brand", event.target.value)}} />
                            </FormGroup>
                            <FormGroup className="col-4">
                                    <Label>Category</Label>
                                    <Input type="select" placeholder="choose category" onChange={event => {this.handleChange("category", event.target.value)}}>
                                        <option>Shoes</option>
                                        <option>Clothing</option>
                                    </Input>
                            </FormGroup>
                            <FormGroup className="col-4">
                                    <Label>Colour</Label>
                                    <Input type="text" onChange={event => {this.handleChange("colour", event.target.value)}} />
                            </FormGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label>Description</Label>
                            <Input type="textarea" onChange={event => {this.handleChange("description", event.target.value)}} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Stock</Label>
                            <div className="d-flex">
                                {this.renderInputStock()}
                                    {/* <FormGroup className="flex-grow-1">
                                        <Label for={`code${item}`}>{item}</Label>
                                        <Input type="number" id={`code${item}`} innerRef={(value) => this[`code${item}`] = value} />
                                    </FormGroup> */}
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <Label>Price</Label>
                            <Input type="number" onChange={event => {this.handleChange("price", parseInt(event.target.value))}} />
                        </FormGroup>
                            
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.btSubmit}>Submit</Button>
                        <Button color="warning" onClick={() => this.setState({modalOpen: !modalOpen})}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
 
export default AddProduct;