import React from 'react';
import { Button, Jumbotron } from 'reactstrap';
import CarouselComp from '../component/carousel';
import Axios from 'axios';
import { API_URL } from '../support/url';
import "../App.css";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            dbCarousel: []
        }
    }

    getCarousel = () => {
        Axios.get(API_URL + '/carousel')
        .then((res) => {
            console.log("GET getCarousel: ", res.data)
            this.setState({ dbCarousel: res.data})
        })
        .catch((err) => {
            console.log("ERR getCarousel: ", err)
        })
    }

    componentDidMount() {
        this.getCarousel()
    }


    render() { 
        return ( 
            <div className="container">
                <Jumbotron className="jumboBanner">
                    <h1 className="display-3 py-5">Welcome to SIMPLE SHOP</h1>
                    <hr className="my-2" />
                    <p>This is the new world of Sport</p>
                    <p className="lead">
                        <Button color="primary" size="sm">Shop Now</Button>
                    </p>
                </Jumbotron>
                <CarouselComp carousel={this.state.dbCarousel} />
            </div>
         );
    }
}
 
export default HomePage;