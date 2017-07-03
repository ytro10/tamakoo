// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { history } from '../../Index';
import { browserHistory } from 'react-router';

import _ from 'underscore';
import { CounterState, ActionDispatcher } from "../../module";
import Tool from '../../Tool';
interface Props {
  value: CounterState;
  actions: ActionDispatcher;
};

const styles = (windowWidth) => { return {
  signup: {
    color: 'rgba(0, 0, 0, 0.87)',
    //position: 'absolute',
    position: 'fixed',
    left: '50vw',
    width: '234px',
    background: 'none',
    textAlign: 'center',
    margin: '30vh auto 0% -141px',
  },
  btn: {
    width:'100%',
    height: '40px',
    gridArea:'5/1/6/7',
    color: '#fff',
    backgroundColor: 'rgb(0, 188, 212)',
    borderStyle: 'none',
    WebkitBorderRadius: '10px',
    fontSize: '20px',
    left: '50%',
    margin: '0 0 0 -50%',
  }
}}

const zeropad = (a:string) => ((''+a).length < 2)? '0'+a : a;

export class SignupUser extends React.Component<Props, void> {
  componentWillMount(){
    this.styles = styles(screen.width);
    console.log("REFS", this.refs)
  }

  signup(){
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    const given = this.refs.given.value;
    const family = this.refs.family.value;
    const year = this.refs.year.value;
    const month = this.refs.month.value;
    const day = this.refs.day.value.length;
    const gender = this.refs.gender.value;
    const handle = this.refs.handle.value;

    if(!!(given&&family&&year&&month&&day&&gender) ){
      const user = {
        mailaddr: this.props.match.params.id,
        givenname: given,
        familyname: family,
        birthday: year+month+day,
        gender: gender,
        hasAcc: [
          { handle:handle }
        ]
      }
      console.log(user)
      this.props.actions.signup(user);
      history.push('/thanks-signup')
    }

    if(!given){
      this.refs.given.style['borderStyle'] = 'all';
      this.refs.given.style['borderWidth'] = '1px';
      this.refs.given.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.given.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!family){
      this.refs.family.style['borderStyle'] = 'all';
      this.refs.family.style['borderWidth'] = '1px';
      this.refs.family.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.family.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!year){
      this.refs.year.style['borderStyle'] = 'all';
      this.refs.year.style['borderWidth'] = '1px';
      this.refs.year.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.year.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!month){
      this.refs.month.style['borderStyle'] = 'all';
      this.refs.month.style['borderWidth'] = '1px';
      this.refs.month.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.month.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!day){
      this.refs.day.style['borderStyle'] = 'all';
      this.refs.day.style['borderWidth'] = '1px';
      this.refs.day.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.day.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!gender){
      this.refs.gender.style['borderStyle'] = 'all';
      this.refs.gender.style['borderWidth'] = '1px';
      this.refs.gender.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.gender.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }
    if(!handle){
      this.refs.handle.style['borderStyle'] = 'all';
      this.refs.handle.style['borderWidth'] = '1px';
      this.refs.handle.style['borderColor'] = 'rgb(248, 6, 6)';
      this.refs.handle.style['backgroundColor'] = 'rgb(255, 178, 220)';
    }

    if(given){
      this.refs.given.style['background'] = '#fff';
      this.refs.given.style['borderColor'] = '#A9A9A9';
    }
    if(family){
      this.refs.family.style['background'] = '#fff';
      this.refs.family.style['borderColor'] = '#A9A9A9';
    }
    if(year){
      this.refs.year.style['background'] = '#fff';
      this.refs.year.style['borderColor'] = '#A9A9A9';
    }
    if(month){
      this.refs.month.style['background'] = '#fff';
      this.refs.month.style['borderColor'] = '#A9A9A9';
    }
    if(day){
      this.refs.day.style['background'] = '#fff';
      this.refs.day.style['borderColor'] = '#A9A9A9';
    }
    if(gender){
      this.refs.gender.style['background'] = '#fff';
      this.refs.gender.style['borderColor'] = '#A9A9A9';
    }
    if(handle){
      this.refs.handle.style['background'] = '#fff';
      this.refs.handle.style['borderColor'] = '#A9A9A9';
    }

  }

  render() {
    const birthYear =
        <select style={{gridArea:'2/1/3/2'}} ref='year' required>
          <option value='' disabled='disabled' selected>Year</option>
          {_.range(100).map( a => <option value={a}>{a+1917}</option> )}
        </select>

    const birthMonth =
        <select style={{gridArea:'2/3/3/4'}} ref='month' required>
          <option value='' disabled='disabled' selected>Month</option>
          {_.range(12).map( a => <option value={zeropad(a+1)}>{zeropad(a+1)}</option> )}
        </select>

    const birthDay =
        <select style={{gridArea:'2/5/3/6'}} ref='day' required>
          <option value='' disabled='disabled' selected>Day</option>
          {_.range(31).map( a => <option value={zeropad(a+1)}>{zeropad(a+1)}</option> )}
        </select>
    
    const birthdate = 
        <div style={{    
            width: '100%',
            display: 'grid',
            gridTemplateRows: '20px 40px',
            gridTemplateColumns: '28% 1fr 28% 1fr 28% 1fr',
            gridGap: '10px'
        }}>
        <legend style={{
            gridArea:'1/1/2/7',
            textAlign: 'left',
        }}>誕生日</legend>
        { birthYear }年
        { birthMonth }月
        { birthDay }日
        </div>

    const gender = 
        <select style={{
            width: '100%',
            height: '40px',
            fontSize: '20px',
        }} name='Gender' ref='gender'>
          <option value='' disabled='disabled' selected>Gender</option>
          <option value='FEMALE'>Female</option>
          <option value='MALE'>Male</option>
          <option value='OTHER'>Other</option>
        </select>

    const yourname = 
        <div style={{    
            width: '100%',
            display: 'grid',
            gridTemplateRows: '20 40px',
            gridTemplateColumns: '50% 50%',
            gridGap: '10px',
            margin: '0 0 20px 0',
        }}>
        <legend style={{
            gridArea:'1/1/2/2',
            textAlign: 'left',
        }}>名前</legend>
        <input style={{gridArea:'2/1/3/2'}} type='text' placeholder='上の名前' ref='given' spellcheck='false'/>
        <input style={{gridArea:'2/2/3/3'}} type='text' placeholder='下の名前' ref='family' spellcheck='false'/>
        </div>

    const handle =
        <input style={{
            width: '100%',
            height: '40px',
            fontSize: '20px',
        }} type='text' placeholder='ihandle nmae' ref='handle' spellcheck='false'/>

        //<input style={} type='text' placeholder='handle name' ref='handle' />
    return (
      <div style={this.styles.signup}>
        { yourname }
        { birthdate }
        { gender }
        { handle }
        <button style={this.styles.btn} placeholder='Signup' onClick={e=>this.signup()}>Sign up</button>
        <Tool value={this.props.value} actions={this.props.actions} />
      </div>

    )
  }
}
