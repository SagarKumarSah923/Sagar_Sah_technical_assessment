// outputNode.js
// Terminal node that receives a value and names the pipeline output.

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  return (
    <BaseNode
      title="Output"
      icon="◁"
      color="#e07b39"
      inputs={[{ id: `${id}-value` }]}
    >
      <label>
        Name:
        <input type="text" value={currName} onChange={(e) => setCurrName(e.target.value)} />
      </label>
      <label>
        Type:
        <select value={outputType} onChange={(e) => setOutputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </label>
    </BaseNode>
  );
};
