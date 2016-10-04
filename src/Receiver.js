import {Component, createElement} from 'react'
import {CONTEXT_NAME, CONTEXT_TYPES} from './constants'

export default class UniqueIDFunctionReceiver extends Component {

  static contextTypes = CONTEXT_TYPES;

  getChildProps() {
    const idProps = this.constructor.uniqueIDToProps(this.context[CONTEXT_NAME])
    return {...idProps, ...this.props}
  }

  render() {
    return createElement(this.constructor.componentClass, this.getChildProps())
  }
}
