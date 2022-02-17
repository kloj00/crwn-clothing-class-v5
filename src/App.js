import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import "./App.css";

import Homepage from "./pages/HomepageComponent/homepageComponent";
import ShopComponent from "./pages/shop/ShopComponent";
import SignInAndSignUp from "./pages/SingUpAndSignIn/SignInAndSignUp";
import HeaderComponent from "./components/Header/HeaderComponent";
import { auth, createUserProfileDocument } from "./firebase/Firebase.utils";
import { setCurrentUser } from "./redux/user/userActions";
class App extends React.Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      } else {
        setCurrentUser(userAuth);
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <BrowserRouter>
        <HeaderComponent />
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/shop" component={ShopComponent} />
          <Route
            exact
            path="/signin"
            render={() =>
              this.props.currentUser ? <Redirect to="/" /> : <SignInAndSignUp />
            }
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  setCurrentUser: user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
