// filterNode.js
// Evaluates a boolean condition and routes data to either the pass or fail output.

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');

  return (
    <BaseNode
      title="Filter"
      icon="⊘"
      color="#e74c3c"
      inputs={[{ id: `${id}-input` }]}
      outputs={[
        { id: `${id}-pass`, label: 'pass' },
        { id: `${id}-fail`, label: 'fail' },
      ]}
    >
      <label>
        Condition:
        <input
          type="text"
          placeholder="e.g. value > 10"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
      </label>
    </BaseNode>
  );
};
