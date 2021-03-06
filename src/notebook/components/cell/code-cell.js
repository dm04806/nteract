import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';

import Inputs from './inputs';
import { TogglableDisplay } from './display-area';

import Editor from './editor';
import LatexRenderer from '../latex';

import Pager from './pager';

class CodeCell extends React.Component {
  static propTypes = {
    cell: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    displayOrder: React.PropTypes.instanceOf(Immutable.List).isRequired,
    id: React.PropTypes.string,
    language: React.PropTypes.string,
    theme: React.PropTypes.string,
    transforms: React.PropTypes.instanceOf(Immutable.Map),
    focused: React.PropTypes.bool,
    pagers: React.PropTypes.instanceOf(Immutable.List),
    running: React.PropTypes.bool,
    focusAbove: React.PropTypes.func,
    focusBelow: React.PropTypes.func,
  };

  static defaultProps = {
    pagers: new Immutable.List(),
    running: false,
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  isOutputHidden() {
    return this.props.cell.get('outputHidden');
  }

  isInputHidden() {
    return this.props.cell.get('inputHidden');
  }

  render() {
    return (<div>
      {
        !this.isInputHidden() ?
          <div className="input-container">
            <Inputs
              executionCount={this.props.cell.get('execution_count')}
              running={this.props.running}
            />
            <Editor
              completion
              id={this.props.id}
              input={this.props.cell.get('source')}
              language={this.props.language}
              focused={this.props.focused}
              theme={this.props.theme}
              focusAbove={this.props.focusAbove}
              focusBelow={this.props.focusBelow}
            />
          </div> : null
      }
      {
        this.props.pagers && !this.props.pagers.isEmpty() ?
          <div className="pagers">
            {
            this.props.pagers.map((pager, key) =>
              <Pager
                className="pager"
                displayOrder={this.props.displayOrder}
                transforms={this.props.transforms}
                bundle={pager.get('data')}
                theme={this.props.theme}
                key={key}
              />
            )
          }
          </div> : null
      }
      <LatexRenderer>
        <div className="outputs">
          <TogglableDisplay
            className="outputs-display"
            outputs={this.props.cell.get('outputs')}
            isHidden={this.isOutputHidden()}
            displayOrder={this.props.displayOrder}
            transforms={this.props.transforms}
            theme={this.props.theme}
          />
        </div>
      </LatexRenderer>
    </div>);
  }
}

export default CodeCell;
