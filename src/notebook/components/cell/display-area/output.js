import React from 'react';

import Immutable from 'immutable';
import { transforms, displayOrder } from 'transformime-react';

import RichestMime from './richest-mime';

const Ansi = require('ansi-to-react');

export default function Output(props) {
  const output = props.output;
  const outputType = output.get('output_type');
  switch (outputType) {
    case 'execute_result':
      // We can defer to display data here, the cell number will be handled
      // separately. For reference, it is output.get('execution_count')
      // The execution_count belongs in the component above if
      // this is a code cell

      // falls through
    case 'display_data': {
      const bundle = output.get('data');
      const metadata = output.get('metadata');
      return (
        <RichestMime
          bundle={bundle}
          metadata={metadata}
          displayOrder={props.displayOrder}
          transforms={props.transforms}
          theme={props.theme}
        />);
    }
    case 'stream': {
      const text = output.get('text');
      switch (output.get('name')) {
        case 'stdout':
        case 'stderr':
          return <Ansi>{text}</Ansi>;
        default:
          return null;
      }
    }
    case 'error': {
      const traceback = output.get('traceback');
      if (!traceback) {
        return <Ansi>{`${output.get('ename')}: ${output.get('evalue')}`}</Ansi>;
      }
      return <Ansi>{traceback.join('\n')}</Ansi>;
    }
    default:
      return null;
  }
}

Output.propTypes = {
  displayOrder: React.PropTypes.instanceOf(Immutable.List),
  output: React.PropTypes.any,
  transforms: React.PropTypes.instanceOf(Immutable.Map),
  theme: React.PropTypes.string,
};

Output.defaultProps = {
  transforms,
  displayOrder,
};
