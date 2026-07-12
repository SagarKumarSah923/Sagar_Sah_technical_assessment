// llmNode.js
// Sends a system prompt + user prompt to a language model and outputs the response.

import { useState } from 'react';
import { BaseNode } from './BaseNode';

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'claude-3-5-sonnet'];

export const LLMNode = ({ id, data }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');

  return (
    <BaseNode
      title="LLM"
      icon="◈"
      color="#9b59b6"
      inputs={[
        { id: `${id}-system`, label: 'system' },
        { id: `${id}-prompt`, label: 'prompt' },
      ]}
      outputs={[{ id: `${id}-response` }]}
    >
      <label>
        Model:
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          {MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
    </BaseNode>
  );
};
