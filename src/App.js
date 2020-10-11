import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import NavbarComponent from "./component/navbar";
import AboutPage from "./pages/about";
import HomePage from "./pages/homepage";
import ProductPage from "./pages/product";
import RegisterPage from "./pages/register";
import { API_URL } from "./support/url";
import Axios from "axios";
import ProductDetail from "./pages/detailProduct";
import ProductManagement from "./pages/productManagement";
import NotFound from "./pages/notFound";
import CarouselManagement from "./pages/carouselManagement";
import { connect } from 'react-redux';
import { login, getProducts, KeepLogin } from './redux/actions';
import CartPage from "./pages/cartUser";
import TransactionPage from "./pages/transaction";
import TransactionAdmin from "./pages/adminTransaction";
import FooterNavbar from "./component/footer";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataUser: {}
    };
  }

  componentDidMount() {
    // this.keepLogin()
    this.getProducts()
    this.props.KeepLogin()
  }

  // keepLogin = () => {
  //   let id = localStorage.getItem("id")
  //   if (id) {
  //     Axios.get(API_URL + `/users?id=${id}`)
  //     .then((res) => {
  //       console.log("SUCCESS KeepLogin: ", res.data)
  //       // VERSI NON-REDUX
  //       // this.setState({ dataUser: res.data[0]})
  //       this.props.login(res.data[0])
  //     })
  //     .catch((err) => {
  //       console.log("ERR keepLogin: ", err)
  //     })
  //   }
  // }

  getProducts = () => {
    Axios.get(API_URL + '/products')
    .then((res) => {
        console.log("GET Products: ", res.data)
        this.props.getProducts(res.data)
    })
    .catch((err) => {
        console.log("ERR getProducts: ", err)
    })
}


  render() {
    // let { dataUser } = this.state
    return (
      <div>
        {/* VERSI NON REDUX */}
        {/* <NavbarComponent user={this.state.dataUser} keep={this.keepLogin} state={() => this.setState({dataUser: {}})} /> */}
        <NavbarComponent user={this.props.user} />
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/product" component={ProductPage}/>
          <Route path="/register" component={RegisterPage}/>
          <Route path="/about" component={AboutPage}/>
          <Route path="/product-detail" component={ProductDetail} />
          {
            // VERSI NON REDUX
            // dataUser.role && dataUser.role==="admin" ?
            // REDUX NON PENYERDEHANAAN
            this.props.user.role && this.props.user.role==="admin" ?
            // role && role==="admin" ?
            <>
              <Route path="/transaction-admin" component={TransactionAdmin} />
              <Route path="/product-admin" component={ProductManagement} />
              <Route path="/carousel-admin" component={CarouselManagement} />
            </>
            :
            <>
              <Route path="/cart" component={CartPage} />
              <Route path="/transaction" component={TransactionPage} />
            </>
          }
          <Route path="*" component={NotFound} />
        </Switch>
        {/* <FooterNavbar /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user : state.authReducer,
    // role: state.authReducer.role
  }
}

export default connect(mapStateToProps, {login, getProducts, KeepLogin})(App);
