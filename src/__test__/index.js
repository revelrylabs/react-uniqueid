import React, {Component} from 'react'
import {mount} from 'enzyme'
import {expect} from 'chai'
import {createStore} from 'redux'
import {Provider as ReduxProvider, connect as connectRedux} from 'react-redux'
import {Provider as IDProvider, connect as connectId} from '../index'

const Item = () => null
const IDConnectedItem = connectId(
  (getUniqueId) => ({id: getUniqueId()})
)(Item)

function getIds(wrapper) {
  return wrapper.find(Item).map((x) => x.prop('id'))
}

function checkIds(wrapper, ids) {
  return expect(getIds(wrapper)).to.deep.equal(ids)
}

describe('ID generation and reset', function() {

  const SimpleTest = ({version}) => (
    <IDProvider version={version}>
      <IDConnectedItem />
      <IDConnectedItem />
    </IDProvider>
  )

  const wrapper = mount(<SimpleTest />)

  it('should start at 1', function() {
    checkIds(wrapper, [1, 2])
  })

  it('should keep counting until its version prop is changed', function() {
    checkIds(wrapper.update(), [3, 4])
  })

  it('should reset the counter when its version prop changes', function() {
    checkIds(wrapper.setProps({version: 1}), [1, 2])
  })
})

describe('Redux integration', function() {

  const initialState = {
    view: 'home/index',
    unconnected: null,
    connected: null,
  }

  const reducer = function(state=initialState, action) {
    const {type, version, unconnected, connected} = action
    switch(type) {
    case 'CHANGE_VERSION':
      return {...state, version}
    case 'CHANGE_UNCONNECTED':
      return {...state, unconnected}
    case 'CHANGE_CONNECTED':
      return {...state, connected}
    default:
      return state
    }
  }

  function changeVersion() {
    return {type: 'CHANGE_VERSION', version: new Date()}
  }

  function changeUnconnected() {
    return {type: 'CHANGE_UNCONNECTED', unconnected: new Date()}
  }

  function changeConnected() {
    return {type: 'CHANGE_CONNECTED', connected: new Date()}
  }

  const store = createStore(reducer)

  const ReduxIDProvider = connectRedux(
    ({version, connected}) => ({version, connected})
  )(IDProvider)

  const ReduxTest = () => (
    <ReduxProvider store={store}>
      <ReduxIDProvider>
        <IDConnectedItem />
        <IDConnectedItem />
      </ReduxIDProvider>
    </ReduxProvider>
  )

  const wrapper = mount(<ReduxTest />)

  it('should still start at 1', function() {
    checkIds(wrapper, [1, 2])
  })

  it('should not count up when its props do not change (because it should not re-render)', function() {
    store.dispatch(changeUnconnected())
    checkIds(wrapper, [1, 2])
  })

  it('should count up when its props change but its version does not (because it should re-render but not reset the counter)', function() {
    store.dispatch(changeConnected())
    checkIds(wrapper, [3, 4])
  })

  it('should reset the counter when its version prop changes', function() {
    store.dispatch(changeVersion())
    checkIds(wrapper, [1, 2])
  })

})
