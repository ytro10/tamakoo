// @flow

export type Task = {
  card_id: number;
  text: string;
  url: string;
}

const ADD_TASK = 'counter/addTask';
const TOOT = 'counter/toot';
const CLEAR_CARDS = 'counter/clear_cards';
const FETCH_REQUEST_START = 'counter/fetch_request_start'
const FETCH_REQUEST_FINISH = 'counter/fetch_request_finish'
const TOUCH_ABLED = 'counter/touch_abled'
const TOUCH_DISABLED = 'counter/touch_disabled'

export interface CounterState {
  num: number;
  tasks: Task[];
  text: string;
  phase: string;
  title: string;
  page: number;
  touchAble: boolean;
}

export type ActionTypes =
    IncrementAction
  | DecrementAction
  | FetchRequestStartAction
  | FetchRequestFinishAction

const initialState:CounterState = {
  num: 0,
  tasks: [],
  text: "over",
  phase: 'ground',
  title: 'welcom',
  page: 0,
  touchAble: true,
};

export default function reducer (
  state: CounterState = initialState,
  action: ActionTypes
): CounterState {
  switch (action.type) {
    case FETCH_REQUEST_START: {
      return Object.assign({}, state, { phase:'loading' })
    }

    case FETCH_REQUEST_FINISH: {
      return Object.assign({}, state, { phase:'ground' })
    }

    case ADD_TASK:// css -> css-in-js
      const newTasks = state.tasks;
      let lis = action.text.split("-");
      let out = lis[0]
      lis.slice(1)
        .map( a => { out+=a[0].toUpperCase()+a.slice(1) })
      out = out
        .replace(/: /g, ":").replace(/:/g, ": '")
        .replace(/ ;/g, ";").replace(/;/g, "',")
      newTasks.push({card_id:state.tasks.length, text:out, url:'None', mode:'toot'});
      return Object.assign({}, state, { tasks:newTasks });

    case TOOT:
      const nextTasks = state.tasks;
      action.text.split('\n')
        .slice(0,self.length-1)
        .map( a => {
          nextTasks.push({card_id:a.split(',')[3], text:a.split(',')[4], url:a.split(',')[5], mode:a.split(',')[6]}) });
      return Object.assign({}, state, { tasks:nextTasks });

    case CLEAR_CARDS:
      if( !action.order ){
        return Object.assign({}, state, { tasks: [] });
      }
      let calledCard = state.tasks[action.order]
      calledCard['mode'] = 'called'
      return Object.assign({}, state, { tasks:[calledCard] });

    case TOUCH_ABLED:
      return Object.assign({}, state, { touchAble:true });

    case TOUCH_DISABLED:
      return Object.assign({}, state, { touchAble:false });


    default:
      return state
  }
}

export class ActionDispatcher {
  dispatch: Dispatch<ReduxAction>

  myHeaders: Object

  constructor(dispatch: Dispatch<ReduxAction>) {
    this.dispatch = dispatch
    this.myHeaders = {
      "Content-Type": "application/json",
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }

  movePage(){
    this.dispatch({ type:CLEAR_CARDS })
  }

  async toot( text: string ): Promise<void> {
    this.dispatch({ type:ADD_TASK, text:text })
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/toot/'+encodeURI(text)
    try {
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        const json: {amount:number} = await response.json();
        this.dispatch({ type: TOOT, text: json.text });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
    }
  }

  async callCard( card_id:number, order:number ): Promise<void> {
    this.dispatch({ type:CLEAR_CARDS, order:order })
    this.dispatch({ type:TOUCH_DISABLED })
    this.dispatch({ type:FETCH_REQUEST_START });

    const url = '/api/callCard/'+card_id;
    try {
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: this.myHeaders,
      })
      if (response.status === 200) { //2xx
        this.dispatch({ type:CLEAR_CARDS })
        const json: {amount:number} = await response.json();
        this.dispatch({ type:TOOT, text:json.text });
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch({ type:FETCH_REQUEST_FINISH });
      this.dispatch({ type:TOUCH_ABLED })
    }
  }

}
