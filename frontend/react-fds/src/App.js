import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom'
import axios from 'axios'
// import Footer from './components/Footer'
import Checkout from './components/Checkout'
import Login from './components/Login'
import Registration from './components/Registration'
import AccountInfo from './components/AccountInfo'
import OrderHistory from './components/OrderHistory'
import CreditCard from './components/CreditCard'
import './App.css'
import PaymentMethods from './components/PaymentMethods'

import CustomersHomepage from './components/CustomersHomepage'
import StaffHomePage from './components/StaffHomePage'
import FDSManagersHomepage from './components/FDSManagersHomepage'
import RiderHomePage from './components/RiderHomePage'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      // States for application login status.
      isLoggedIn: true,
      userId: 2,
      userType: 4,
      userTypeStr: 'fdsmanagers',

      // State for full list of items on the Menu table.
      items: [],

      // State for food items display page.
      itemsOnDisplay: [],

      // State for restaurant list.
      restaurants: [],
      restaurantsFilter: [],

      // State for food categories list.
      foodCategories: [],
      foodCategoriesFilter: [],

      // State for local item cart.
      cart: [],

      // State for viewing filter panel.
      showFilterPanel: true
    }

    // Function bindings.
    this.renderHomepage = this.renderHomepage.bind(this)

    this.initItems = this.initItems.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.toggleFilterPanel = this.toggleFilterPanel.bind(this)
    this.handleAddToCart = this.handleAddToCart.bind(this)
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this)
    this.clearCart = this.clearCart.bind(this)
    this.updateItemsDisplayed = this.updateItemsDisplayed.bind(this)

    this.handleAllBtn = this.handleAllBtn.bind(this)
    this.handleClearBtn = this.handleClearBtn.bind(this)
    this.handleRChange = this.handleRChange.bind(this)
    this.handleFCChange = this.handleFCChange.bind(this)
  }

  toggleFilterPanel() {
    this.setState(prev => ({
      showFilterPanel: !prev.showFilterPanel
    }))
  }

  handleAddToCart(e) {
    //Check if this is the first item.
    if (this.state.cart.length > 0) {
      // Get restaurant name from first item.
      let restaurant = this.state.items[this.state.cart[0]].rname

      // Check if food item belongs to the same restaurant as first item.
      if (this.state.items[e.target.value].rname !== restaurant) {
        alert('Please select items from a single restaurant for each order.')
        return
      }
    }

    let itemToAdd = parseInt(e.target.value)

    this.setState(prev => ({
      cart: [...prev.cart, itemToAdd]
    }))
  }

  handleRemoveFromCart(e) {
    let itemToDelete = e.currentTarget.value
    let tempCart = [...this.state.cart].filter(each => each !== parseInt(itemToDelete))
    this.setState({ cart: tempCart })
  }

  clearCart() {
    this.setState({ cart: [] })
  }

  updateUser(uid, type, typeStr) {
    this.setState({ userId: uid, isLoggedIn: true, userType: type, userTypeStr: typeStr })
  }

  handleLogout() {
    this.setState({ 
      isLoggedIn: false, 
      userId: null, 
      userType: null, 
      userTypeStr: null,

      // Clear item display filters.
      restaurantsFilter: [],
      foodCategoriesFilter: []
    })
    alert('You have been logged out.')
  }

  initItems(menu) {
    this.setState({ items: menu, itemsOnDisplay: menu })
  }

  updateItemsDisplayed(e) {
    e.preventDefault()

    // Construct url query strings.
    const startUrlString = 'http://localhost:5000/menu/filter'

    let rid = this.state.restaurants.filter((item, i) => {
      return this.state.restaurantsFilter[i]
    })
    let rList = ''
    rid.forEach(item => rList += item.rid + ',')
    rList = rList.substring(0, rList.length - 1)


    let fcid = this.state.foodCategories.filter((item, i) => {
      return this.state.foodCategoriesFilter[i]
    })
    let fcList = ''
    fcid.forEach(item => fcList += '\'' + item.fcname + '\',')
    fcList = fcList.substring(0, fcList.length - 1)

    // Retrieve food items from menu from the database
    // with filters applied.
    axios.get(
      startUrlString
      + '?rid=' + rList
      + '&fcname=' + fcList
    )
      .then(res => {
        this.setState({ itemsOnDisplay: res.data })
      })
      .catch(err => {
        alert(err)
      })
  }

  handleAllBtn(e) {
    let allTrue = []
    switch (e.target.value) {
      case '1': // Check restaurant checkboxes.
        for (let i = 0; i < this.state.restaurants.length; i++) {
          allTrue.push(true)
        }
        this.setState({ restaurantsFilter: allTrue })
        break
      case '2': // Check food categories checkboxes.
        for (let i = 0; i < this.state.foodCategoriesFilter.length; i++) {
          allTrue.push(true)
        }
        this.setState({ foodCategoriesFilter: allTrue })
        break
    }
  }

  handleClearBtn(e) {
    let allFalse = []
    switch (e.target.value) {
      case '1': // Clear restaurant checkboxes.
        for (let i = 0; i < this.state.restaurants.length; i++) {
          allFalse.push(false)
        }
        this.setState({ restaurantsFilter: allFalse })
        break
      case '2': // Clear food categories checkboxes.
        for (let i = 0; i < this.state.foodCategoriesFilter.length; i++) {
          allFalse.push(false)
        }
        this.setState({ foodCategoriesFilter: allFalse })
        break
    }

  }

  handleRChange(e) {
    let tempCheckboxState = [...this.state.restaurantsFilter]
    tempCheckboxState[e.target.value] = !tempCheckboxState[e.target.value]
    this.setState({ restaurantsFilter: tempCheckboxState })

  }

  handleFCChange(e) {
    let tempCheckboxState = [...this.state.foodCategoriesFilter]
    tempCheckboxState[e.target.value] = !tempCheckboxState[e.target.value]
    this.setState({ foodCategoriesFilter: tempCheckboxState })
  }

  componentDidMount() {
    // Retrieve all food items from menu from the database.
    axios.get('http://localhost:5000/menu')
      .then(res => {
        this.initItems(res.data)
      })
      .catch(err => {
        alert(err)
      })

    // Retrieve all restaurant information from the database.
    axios.get('http://localhost:5000/restaurants')
      .then(res => {
        this.setState({
          restaurants: res.data
        })
        res.data.forEach(item => {
          let temp = [...this.state.restaurantsFilter]
          temp.push(true)
          this.setState({ restaurantsFilter: temp })
        })
      })
      .catch(err => {
        alert(err)
      })

    // Retrieve all food categories from the database.
    axios.get('http://localhost:5000/foodcategories')
      .then(res => {
        this.setState({
          foodCategories: res.data
        })
        res.data.forEach(item => {
          let temp = [...this.state.foodCategoriesFilter]
          temp.push(true)
          this.setState({ foodCategoriesFilter: temp })
        })
      })
      .catch(err => {
        alert(err)
      })
  }

  renderHomepage() {
    if (this.state.isLoggedIn) {
      return <Redirect to={'/' + this.state.userTypeStr} />
    } else {
      return <Redirect to='/login' />
    }
  }

  render() {
    return (
      <div className='App'>
        <Router>
          <Route path='/login' exact>
            <Login
              isLoggedIn={this.state.isLoggedIn}
              userId={this.state.userId}
              updateUser={this.updateUser}
            />
          </Route>
          <Route path='/register' exact>
            <Registration />
          </Route>
          <Route path='/orderHistory' exact>
            <OrderHistory
              isLoggedIn={this.state.isLoggedIn}
              userId={this.state.userId}
            />
          </Route>
          <Route path='/accountinfo' exact>
            <AccountInfo
              isLoggedIn={this.state.isLoggedIn}
              userId={this.state.userId}
              userType={this.state.userType}
            />
          </Route>
          <Route path='/accountinfo/credit_card' exact>
            <CreditCard
              isLoggedIn={this.state.isLoggedIn}
              userId={this.state.userId}
              userType={this.state.userType}
            />
          </Route>
          <Route path='/checkout' exact>
            <Checkout
              isLoggedIn={this.state.isLoggedIn}
              userId={this.state.userId}
              items={this.state.items}
              cart={this.state.cart}
              clearCart={this.clearCart}
            />
          </Route>

          <Route path='/customers' exact>
            <CustomersHomepage
              isLoggedIn={this.state.isLoggedIn}
              userId={this.state.userId}
              userTypeStr={this.state.userTypeStr}
              handleLogout={this.handleLogout}

              items={this.state.items}
              cart={this.state.cart}

              showFilterPanel={this.state.showFilterPanel}
              toggleFilterPanel={this.toggleFilterPanel}
              updateItemsDisplayed={this.updateItemsDisplayed}
              itemsOnDisplay={this.state.itemsOnDisplay}

              restaurants={this.state.restaurants}
              restaurantsFilter={this.state.restaurantsFilter}

              foodCategories={this.state.foodCategories}
              foodCategoriesFilter={this.state.foodCategoriesFilter}

              handleRChange={this.handleRChange}
              handleFCChange={this.handleFCChange}
              handleAllBtn={this.handleAllBtn}
              handleClearBtn={this.handleClearBtn}
              handleAddToCart={this.handleAddToCart}
              handleRemoveFromCart={this.handleRemoveFromCart}
            />
          </Route>
          <Route path='/riders' exact>
            {/* <Riders /> */}
            <RiderHomePage
              isLoggedIn={this.state.isLoggedIn}
              userId={this.state.userId}
              userTypeStr={this.state.userTypeStr}
            />
          </Route>
          <Route path='/staffs' exact>
            <StaffHomePage />
          </Route>
          <Route path='/fdsmanagers' exact >
            <FDSManagersHomepage
              userId={this.state.userId}
              userType={this.state.userType}
              userTypeStr={this.state.userType}
              isLoggedIn={this.state.isLoggedIn}
            />
          </Route>

          <Route path='/' exact>
            {this.renderHomepage()}
          </Route>
        </Router>
      </div>
    )
  }
}

export default App


