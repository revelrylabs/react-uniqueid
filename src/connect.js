import {Component} from 'react'
import Receiver from './Receiver'

export default function connect(uniqueIDToProps) {
  return function(componentClass) {
    return class extends Receiver {
      static componentClass = componentClass;
      static uniqueIDToProps = uniqueIDToProps;
    }
  }
}
