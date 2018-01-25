# react-uniqueid

Provider component and connect function for generating unique identifiers in React.

## Rationale

Consider the following HTML:

```html
<ul>
  <li>
    <radio id="state-2" name="city" value="LA">
    <label for="state-2">Louisiana</label>
  </li>
  <li>
    <radio id="state-1" name="city" value="NY">
    <label for="state-1">New York</label>
  </li>
</ul>
```

Sometimes the DOM requires us to provide unique IDs.
This can be annoying when we don't care what those IDs specifically are.

Sometimes we want to be able to dynamically generate forms.
That means we have to dynamically generate unique IDs.

Solutions like `lodash.uniqueid` don't work with isomorphic apps.
The counter on the server keeps incrementing on every page request.
The counter on the client resets on every page request.
This causes the client/server props and checksums to go out of sync and forces full re-renders on the client.

Use this library if you want a unique ID generator that will reset (or not) when you want it to.

## Usage

```javascript
import React, {Component} from 'react'
import {Provider, connect} from 'react-uniqueid'

// Wrap your hierarchy in a `Provider` so that descendents can receive the ID generation function.
class Page extends Component {
  render() {
    <Provider>
      {this.props.children}
    </Provider>
  }
}

// This is the version of the component where you would have to set the ID prop explicitly.
class RadioItemWithoutAutoID extends Component {
  render() {
    const {id, name, value, label} = this.props
    return (
      <li>
        <radio id={id} name={name} value={value} />
        <label htmlFor={id}>{label}</label>
      </li>
    )
  }
}

// Produce a component that receives a unique ID automatically.
// Now we can render it anywhere without having to keep track of what other IDs exist.
// The `connect` API is very much like the one in `react-redux` if you are familiar with that.
const RadioItem = connect(
  (getId) => ({id: getId()})
)(RadioItemWithoutAutoID)

// PUT IT ALL TOGETHER.

// This is a nice reusable component we can use to turn data into lists of RadioItems.
class RadioListInput extends Component {
  render() {
    const {name, options} = this.props
    const items = options.map((valueAndLabel) => (
      <RadioItem name={name} {...valueAndLabel} />
    ))
    return (
      <ul>{items}</ul>
    )
  }
}

// This could just as easily come from a server instead of being hard-coded.
const STATES_OPTIONS = [
  {value: 'LA', label: 'Louisiana'},
  {value: 'NY', label: 'New York'},
]

// Here's how we might concoct a form that has a RadioListInput.
class StatesForm extends Component {
  render() {
    return (
      <form method="post" action="/states">
        <RadioListInput name="states" options={STATES_OPTIONS} />
        <button>Submit</button>
      </form>
    )
  }
}

// And here is the page that hosts the form. Remember that the `Page` component is providing unique IDs.
class StatesFormPage extends Component {
  render() {
    return (
      <Page>
        <h1>Add States</h1>
        <StatesForm />
      </Page>
    )
  }
}
```
