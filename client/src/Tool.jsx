import React from 'react';
import { Link } from 'react-router-dom';
import AddButtonSVG from '../assets/svg/add-button-inside-black-circle.svg';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { history } from './Index';

const styles = (windowWidth) => { return {
  gif: {
    width: '100vw',
    height: '60vh',
    position: 'fixed',
    left: '0',
    top: '20vh',
    overflow: 'hidden',
    //margin: 'auto 0 auto 0',
    zIndex: '999',
  },
  bar: {
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: 'rgb(0, 188, 212)',
    boxSizing: 'border-box',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    width: '100vw',
    //height: '56px',
    //display: 'flex',
    display: 'grid',
    gridGap: '10vw',
    //justifyContent: 'spaceBetween',
    borderRadius: '0px',
    //zIndex: '999',
    position: 'fixed',
    left: '0',
    bottom: '0',
  },
  login: {
    backgroundColor: '#ddd',
    width: '20vw',
    //height: '56px',
    position: 'fixed',
    left: '0',
    //bottom: '0',
    borderRadius: '5px',
    margin: '0 1vh 0 3vw',
    //padding: '1vh 0 1vh 0',
    fontSize: '16px',
    display: 'table',
  },
  newTab: {
    margin: '-24px 0 0 -24px',
    position: 'fixed',
    width: '48px',
    height: '48px',
    left: '50vw',
    bottom: '0',
  },
  newTabBtn: {
    width: '100%',
    height: '100%',
  },
}}

export default class Tool extends React.Component<Props,{}> {
  componentWillMount(){
    this.styles = styles(screen.width);
  }

  render() {
    console.log('>>>',this.props)
    const accountList = this.props.value.loginUser.hasAcc
      .map( account =>
        <MenuItem value={account.alias} primaryText={'@'+account.alias}
          containerElement={<Link to={'/entry/'+account.alias}/>}/>
        )

    const newTabBtn =
      <div style={this.styles.newTab}>
        <Link to='/' onClick={e=>{
            this.props.actions.initState()
        }}>
          <img style={this.styles.newTabBtn} src={AddButtonSVG} />
        </Link>
      </div>

    const preference =
      this.props.value.isLoggedin?
        <MenuItem primaryText='preference' containerElement={<Link to='/preference/index'/>}/>
      :null

    const signin =
      this.props.value.isLoggedin?
        <MenuItem primaryText='add account' containerElement={<Link to='/mailentry/signin'/>}/>
      :
        <MenuItem primaryText='sign in' containerElement={<Link to='/mailentry/signin'/>}/>

    const gif = 
      this.props.value.isLoading?
        <img style={this.styles.gif} src='https://cdn.dribbble.com/users/63485/screenshots/1379948/mortphing-shape-gif-preloader.gif'/>
      :null      
    console.log(gif)    

    const test =
            this.props.value.isLoading? 
<div style={this.styles.gif}><strong>NOW LOADING</strong></div> :
<div style={this.styles.gif}><strong>hello</strong></div> 
    

    return (
      <Toolbar style={this.styles.bar}>
        { gif } 
        <ToolbarGroup style={this.styles.login} containerStyle={{padding:'0'}} firstChild={true}>
          <DropDownMenu containerStyle={{width:'20vw'}} value={this.props.value.signinAcc.alias} onChange={(event, index, value) => {
            this.props.actions.login(value);
          }}>
            { preference }
            { signin }
            { this.props.value.isLoggedin }
            <hr/>
            { accountList }
          </DropDownMenu>
          { newTabBtn }
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
