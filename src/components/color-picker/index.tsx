import { Component } from 'react';

import List from './component/list';

import './index.less';

export default class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <List {...this.props}></List>;
  }
}
