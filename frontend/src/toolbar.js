// toolbar.js
import { DraggableNode } from './draggableNode';
import styles from './styles/Toolbar.module.css';

// Single source of truth for node types, colors, and toolbar icons
const NODES = [
  { type: 'customInput', label: 'Input',     color: '#4a90d9', icon: '▷'  },
  { type: 'llm',         label: 'LLM',       color: '#9b59b6', icon: '◈'  },
  { type: 'customOutput',label: 'Output',    color: '#e07b39', icon: '◁'  },
  { type: 'text',        label: 'Text',      color: '#27ae60', icon: 'T'  },
  { type: 'filter',      label: 'Filter',    color: '#e74c3c', icon: '⊘'  },
  { type: 'merge',       label: 'Merge',     color: '#16a085', icon: '⊕'  },
  { type: 'transform',   label: 'Transform', color: '#f39c12', icon: '↻'  },
  { type: 'api',         label: 'API Call',  color: '#2980b9', icon: '⬡'  },
  { type: 'note',        label: 'Note',      color: '#7f8c8d', icon: '✎'  },
];

export const PipelineToolbar = () => (
  <div className={styles.toolbar}>
    <div className={styles.brand}>
      Vector<span>Shift</span>
    </div>

    <div className={styles.palette}>
      <span className={styles.paletteLabel}>Nodes</span>
      <div className={styles.chips}>
        {NODES.map(({ type, label, color, icon }) => (
          <DraggableNode key={type} type={type} label={label} color={color} icon={icon} />
        ))}
      </div>
    </div>

    {/* Contextual hint — hidden on very narrow screens via overflow */}
    <span className={styles.hint}>Drag onto canvas</span>
  </div>
);
