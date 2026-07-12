// apiNode.js
// Makes an HTTP request to an external endpoint and passes the response downstream.

import { useState } from 'react';
import { BaseNode } from './BaseNode';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

export const ApiNode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');

  return (
    <BaseNode
      title="API Call"
      icon="⬡"
      color="#2980b9"
      inputs={[{ id: `${id}-payload` }]}
      outputs={[{ id: `${id}-response` }]}
    >
      <label>
        Method:
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      <label>
        URL:
        <input
          type="text"
          placeholder="https://api.example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: '100%' }}
        />
      </label>
    </BaseNode>
  );
};
