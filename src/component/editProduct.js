import Axios from 'axios';
import React from 'react';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Swal from 'sweetalert2';
import { API_URL } from '../support/url';

class EditProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            id: props.data.id,
            name: props.data.name,
            brand: props.data.brand,
            category: props.data.category,
            colour: props.data.colour,
            description: props.data.description,
            price: props.data.price,
            stock: props.data.stock,
            images: props.data.images,
            sizeShoes: [38, 39, 40, 41, 42],
            sizeClothing: ["S", "M", "L", "XL", "XXL"],
            listGambar: ["images1", "images2", "images3", "images4", "images5"]
        }
    }

    
    handleChange = (property, value) => {
        this.setState({ [property]: value })
    }

    renderInputStock = () => {
        let { category, stock } = this.state
        return this.state[`size${category}`].map((item, index) => {
            return (
                <FormGroup>
                    <Label>{item}</Label>
                    <Input type="number" defaultValue={stock[index].total} 
                    innerRef={value => this[`code${item}`] = value}
                    />
                </FormGroup>
            )
        })
    }

    btSave = (id) => {
        // // versi PR
        // let { name, brand, colour, category, price, description, stock, images, listGambar } = this.state
        
        // // PR => Me-replace stock[idx].total menggunakan variable penampung
        // let stock = [...this.state.stock]
        // this.state[`size${category}`].forEach((item, index) => {
            //     let value = this[`code${item}`].value
        //     stock[index].total = value
        // })

        // let images = [...this.state.images]
        // this.state.listGambar.forEach((item, index) => {
        //     let value = this[item].value
        //     images[index] = value
        // })
        let { name, brand, colour, category, price, description, stock, images, listGambar } = this.state
        
        // Mentor => Me-replace menggunakan splice
        this.state[`size${category}`].forEach((item, index) => {
            stock.splice(index, 1, { code: item, total: parseInt(this[`code${item}`].value) })
        })

        listGambar.forEach((item, index) => {
            images.splice(index, 1, this[item].value)
        })

        Axios.patch(API_URL + `/products/${id}`, {name, brand, colour, category, price, description, images, stock})
        .then((res) => {
            console.log("PATCH btSave: ", res.data)
            this.props.getProducts()
            this.props.editClose()
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product Successfully Updated'
            })

        })
        .catch((err) => {
            console.log("ERR btSave: ", err)
        })

    }

    render() { 
        console.log("cek edit: ", this.state.stock)
        let { id, name, brand, colour, category, price, description, images, listGambar} = this.state
        return (  
            <div>
                <Modal isOpen={this.props.editOpen}>
                    <ModalHeader>Edit {this.props.selectedIdx + 1}</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label>Name</Label>
                                <Input value={name} type="text" onChange={event => this.handleChange("name", event.target.value)} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Images</Label>
                                <div className="d-flex flex-wrap">
                                    {
                                        listGambar.map((item, index) => {
                                            return <Input style={{ width: "30%"}} 
                                                    type="text" 
                                                    defaultValue={images[index]} 
                                                    innerRef= { value => this[item] = value}
                                                    />
                                        })
                                    }
                                </div>
                            </FormGroup>
                            <div className="row">
                                <FormGroup className="col-md-4">
                                    <Label>Brand</Label>
                                    <Input value={brand} type="text" onChange={event => this.handleChange("brand", event.target.value)} />
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <Label>Category</Label>
                                    <Input type="select" value={category} onChange={event => this.handleChange("brand", event.target.value)}>
                                        <option>Select...</option>
                                        <option value="Shoes">Shoes</option>
                                        <option value="Clothing">Clothing</option>
                                    </Input>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <Label>Colour</Label>
                                    <Input value={colour} type="text" onChange={event => this.handleChange("colour", event.target.value)} />
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input value={description} type="textarea" onChange={event => this.handleChange("description", event.target.value)} />
                            </FormGroup>
                            <FormGroup>
                                <Label>Stock</Label>
                                <div className="d-flex">
                                    {this.renderInputStock()}
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label>Price</Label>
                                <Input value={price} type="number" onChange={event => this.handleChange("price", parseInt(event.target.value))} />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.btSave(id)}>Save</Button>
                        <Button color="secondary" onClick={this.props.editClose}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
 
export default EditProduct;