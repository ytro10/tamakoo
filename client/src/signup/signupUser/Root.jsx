// @flow
import { SignupUser } from './SignupUser';
import { connect } from "react-redux";
import { ActionDispatcher } from "../../module";
import { Dispatch } from "redux";

export default connect(
  (store: any) => ({value: store.counter}),
  (dispatch: Dispatch<any>) => ({actions: new ActionDispatcher(dispatch)})
)(SignupUser);
