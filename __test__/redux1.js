import {configureStore} from './helpers/server';
import rootReducer from '../src/client/reducers';
import chai from "chai";

const MESSAGE = "message";

chai.should();

describe('Fake redux __test__', function(){
  it('alert it', function(done){
    const initialState = {};
    const store =  configureStore(rootReducer, null, initialState, {
      ALERT_POP: ({dispatch, getState}) =>  {
        const state = getState();
        state.message.should.equal(MESSAGE);
        done();
      }
    });
    store.dispatch(alert(MESSAGE));
  });

});
