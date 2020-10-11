import Axios from 'axios';
import React from 'react';
import { Button, Card, CardBody, CardDeck, CardImg, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import { API_URL } from '../support/url';
import { connect } from 'react-redux';
import { getSlide } from '../redux/actions'

class CarouselManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            // dbCarousel: [],
            selectedIdx: null,
            modalOpen: false,
            dropOpen: false,
            newSlideOpen: false,
        }
    }

    componentDidMount() {
        this.getCarousel()
    }

    getCarousel = (order) => {
        let url = order ? `/carousel?_sort=title&_order=${order}` : '/carousel'
        Axios.get(API_URL + url)
        .then((res) => {
            console.log("RES getCarousel: ", res.data)
            // this.setState({dbCarousel: res.data})
            this.props.getSlide(res.data)
            console.log("cek getSlide", this.props.getSlide)
        })
        .catch((err) => {
            console.log("ERR getCarousel: ", err)
        })
    }

    // renderCarousel = () => {
    //     return this.props.slides.map((item, index) => {
    //         return (
    //             <tr key={index}>
    //                 <th>{index + 1}</th>
    //                 <td><img src={item.image} height="100px" alt={item.title}/> </td>
    //                 <td>"{item.title}"</td>
    //                 {/* <td className="font-italic">{item.image}</td> */}
    //                 <td>
    //                     <Button color="warning" onClick={() => this.btEdit(index)}>Edit</Button>
    //                     <Button color="danger" onClick={() => this.btDelete(item.id)}>Delete</Button>
    //                 </td>
    //             </tr>
    //         )
    //     })
    // }

    renderCardSlide = () => {
        return this.props.slides.map((item, index) => {
            return (
                <Card className="col-md-4" key={index}>
                    <CardImg height="200px" src={item.image} alt={index} />
                    <CardBody>
                        <CardTitle>"{item.title}"</CardTitle>
                        <Button style={{marginRight: 5}} color="warning" onClick={() => this.btEdit(index)}>Edit</Button>
                        <Button color="danger" onClick={() => this.btDelete(item.id)}>Delete</Button>
                    </CardBody>
                </Card>
            )
        })
    }

    btDelete = (id) => {
        Axios.delete(API_URL + `/carousel/${id}`)
        .then((res) => {
            console.log("SUCCESS btDelete", res.data)
            this.getCarousel()
        })
        .catch((err) => {
            console.log("ERR btDeleteSlide", err)
        })
    }

    btEdit = (index) => {
        this.setState({selectedIdx: index, modalOpen: !this.state.modalOpen})
        console.log(index)
    }

    btSave = (id) => {
        let image = this.slideImg.value
        let title = this.slideTitle.value

        Axios.patch(API_URL + `/carousel/${id}`, {image, title})
        .then((res) => {
            console.log("Edit Success", res.data)
            this.getCarousel()
            this.setState({ modalOpen: !this.state.modalOpen})
        })
        .catch((err) => {
            console.log("ERR btSaveSlide", err)
        })
    }
    
    btSaveNewSlide = () => {
        let image = this.newSlideImg.value
        let title = this.newSlideTitle.value
    
        Axios.post(API_URL + `/carousel`, {image, title})
        .then((res) => {
            console.log("New Slide Success", res.data)
            this.getCarousel()
            this.setState({ newSlideOpen: !this.state.newSlideOpen})
        })
        .catch((err) => {
            console.log("ERR newSlide", err)
        })
    }

    render() { 
        let { modalOpen, dbCarousel, selectedIdx } = this.state
        return (  
            <div className="container">
                <h3 className="text-center my-3">Slide Management</h3>
                <Button className="mb-2" color="info" onClick={() => this.setState({newSlideOpen: !this.state.newSlideOpen})}>Add New Slide</Button>
                <Modal isOpen={this.state.newSlideOpen}>
                    <ModalHeader toggle={() => this.setState({newSlideOpen: !this.state.newSlideOpen})}>Add New Slide</ModalHeader>
                    <ModalBody>
                        <Form>
                            <Input className="mb-2" type="text" placeholder="Slide Image" innerRef={(value) => this.newSlideImg = value} />
                            <Input type="text" placeholder="Slide Title" innerRef={(value) => this.newSlideTitle = value} />
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.btSaveNewSlide}>Save</Button>
                        <Button color="secondary" onClick={() => this.setState({newSlideOpen: !this.state.newSlideOpen})} >Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Dropdown className="mb-2" isOpen={this.state.dropOpen} toggle={() => this.setState({dropOpen: !this.state.dropOpen})}>
                    <DropdownToggle caret>
                        Sort
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => this.getCarousel("asc")}>Ascending</DropdownItem>
                        <DropdownItem onClick={() => this.getCarousel("desc")}>Descending</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                {/* <Table hover> */}
                    {/* <thead> */}
                        {/* <th>No.</th> */}
                        {/* <th>Image</th> */}
                        {/* <th>Title</th> */}
                        {/* <th>Link</th> */}
                        {/* <th>Action</th> */}
                    {/* </thead> */}
                    {/* <tbody> */}
                        {/* {this.renderCarousel()} */}
                    {/* </tbody> */}
                {/* </Table> */}
                <div className="row">
                    {this.renderCardSlide()}
                </div>
                {
                    selectedIdx !== null &&
                    <Modal isOpen={modalOpen}>
                        <ModalHeader>
                            Edit Slide
                        </ModalHeader>
                        <ModalBody>
                            <Form>
                                <Input type="text" placeholder="Slide Image" defaultValue={this.props.slides[selectedIdx].image} innerRef={(value) => this.slideImg = value} />
                                <Input type="text" placeholder="Slide Title" defaultValue={this.props.slides[selectedIdx].title} innerRef={(value) => this.slideTitle = value} />
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={() => this.btSave(this.props.slides[selectedIdx].id)}>Save</Button>
                            <Button color="secondary" onClick={() => this.setState({modalOpen: !this.state.modalOpen, selectedIdx: null})}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                }

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("mapstate slides", state.slideReducer.slide)
    return {
        slides: state.slideReducer.slide
    }
}
 
export default connect(mapStateToProps, {getSlide})(CarouselManagement);