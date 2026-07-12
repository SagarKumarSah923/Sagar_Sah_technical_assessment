// noteNode.js
// Canvas annotation node — carries no data in the pipeline, only a human-readable note.
// Demonstrates that BaseNode handles are entirely optional (inputs/outputs default to []).

import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || '');

  return (
    // No inputs or outputs — this node is purely decorative / documentation
    <BaseNode title="Note" icon="✎" color="#7f8c8d">
      <textarea
        rows={3}
        placeholder="Add a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ width: '100%', resize: 'vertical', fontSize: 12 }}
      />
    </BaseNode>
  );
};
