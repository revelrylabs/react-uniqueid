import React, {Component} from 'react'
import {CONTEXT_NAME, CONTEXT_TYPES} from './constants'

function createUniqueIDFunction() {
  let counter = 0
  return function() {
    return ++counter
  }
}

export default class UniqueIDFunctionProvider extends Component {

  static childContextTypes = CONTEXT_TYPES;

  constructor(props) {
    super(props)
    this.state = {fn: createUniqueIDFunction()}
  }

  getChildContext() {
    const context = {}
    context[CONTEXT_NAME] = this.state.fn
    return context
  }

  componentWillReceiveProps({version}) {
    if(version != this.props.version) {
      this.setState({fn: createUniqueIDFunction()})
    }
  }

  render() {
    return <div>{this.props.children}</div>
  }
}
