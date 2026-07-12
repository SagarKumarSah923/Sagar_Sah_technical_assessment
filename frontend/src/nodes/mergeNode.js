// mergeNode.js
// Combines two upstream values into a single output (e.g. concatenate or join).

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => {
  const [separator, setSeparator] = useState(data?.separator || ' ');

  return (
    <BaseNode
      title="Merge"
      icon="⊕"
      color="#16a085"
      inputs={[
        { id: `${id}-input_a`, label: 'A' },
        { id: `${id}-input_b`, label: 'B' },
      ]}
      outputs={[{ id: `${id}-merged` }]}
    >
      <label>
        Separator:
        <input
          type="text"
          value={separator}
          onChange={(e) => setSeparator(e.target.value)}
        />
      </label>
    </BaseNode>
  );
};
