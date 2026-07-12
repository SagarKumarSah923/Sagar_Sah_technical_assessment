// transformNode.js
// Applies a string transformation to the incoming value before passing it on.

import { useState } from 'react';
import { BaseNode } from './BaseNode';

const TRANSFORMS = ['Uppercase', 'Lowercase', 'Trim', 'Reverse'];

export const TransformNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'Uppercase');

  return (
    <BaseNode
      title="Transform"
      icon="↻"
      color="#f39c12"
      inputs={[{ id: `${id}-input` }]}
      outputs={[{ id: `${id}-output` }]}
    >
      <label>
        Operation:
        {/* Dropdown keeps the set of operations extensible without changing the node shell */}
        <select value={operation} onChange={(e) => setOperation(e.target.value)}>
          {TRANSFORMS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
    </BaseNode>
  );
};
