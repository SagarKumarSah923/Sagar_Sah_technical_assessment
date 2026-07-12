// BaseNode.js — shared shell for every node type
import { Fragment } from 'react';
import { Handle, Position } from 'reactflow';
import styles from '../styles/BaseNode.module.css';

// Spreads N handles evenly along an edge (e.g. 2 → 33% and 67%)
const spreadPositions = (count) =>
  Array.from({ length: count }, (_, i) => `${((i + 1) / (count + 1)) * 100}%`);

/**
 * Props:
 *   title   {string}  — header text
 *   icon    {string}  — optional Unicode symbol shown in a badge in the header
 *   color   {string}  — accent color — injected as --node-color CSS variable
 *   style   {object}  — optional overrides on the root div (e.g. dynamic width)
 *   inputs  {Array}   — [{ id, label?, style? }] → target handles on the left
 *   outputs {Array}   — [{ id, label?, style? }] → source handles on the right
 *   children          — field controls rendered in the body
 */
export const BaseNode = ({ title, icon, color, inputs = [], outputs = [], children, style = {}, showLabels = false }) => {
  const inputTops  = spreadPositions(inputs.length);
  const outputTops = spreadPositions(outputs.length);

  // Labels are only meaningful when 2+ handles share the same side — a single
  // handle is obvious without a label. showLabels overrides this for nodes like
  // TextNode where variable names are semantically important even for 1 handle.
  const showInputLabels  = showLabels || (inputs.length  > 1 && inputs.some(i  => i.label));
  const showOutputLabels = showLabels || (outputs.length > 1 && outputs.some(o => o.label));

  // Pad the body inward so handle labels never overlap field content
  const bodyPad = {
    ...(showInputLabels  && { paddingLeft:  '54px' }),
    ...(showOutputLabels && { paddingRight: '54px' }),
  };

  // Nodes with 2+ handles on one side need a minimum height so handles
  // land in the body area below the header (~31 px tall)
  const needsMinHeight = inputs.length > 1 || outputs.length > 1;

  return (
    <div
      className={styles.node}
      style={{
        '--node-color': color,
        ...(needsMinHeight && { minHeight: '110px' }),
        ...style,
      }}
    >
      <div className={styles.header}>
        {icon && <span className={styles.headerIcon}>{icon}</span>}
        {title}
      </div>

      <div className={styles.body} style={bodyPad}>{children}</div>

      {/* Target (input) handles — left edge */}
      {inputs.map((input, i) => (
        <Fragment key={input.id}>
          <Handle
            type="target"
            position={Position.Left}
            id={input.id}
            title={input.label}
            style={{ top: inputTops[i], ...input.style }}
          />
          {/* Only render the label element when disambiguation is needed */}
          {showInputLabels && input.label && (
            <span className={styles.handleLabel} style={{ top: inputTops[i], left: 16 }}>
              {input.label}
            </span>
          )}
        </Fragment>
      ))}

      {/* Source (output) handles — right edge */}
      {outputs.map((output, i) => (
        <Fragment key={output.id}>
          <Handle
            type="source"
            position={Position.Right}
            id={output.id}
            title={output.label}
            style={{ top: outputTops[i], ...output.style }}
          />
          {showOutputLabels && output.label && (
            <span className={styles.handleLabel} style={{ top: outputTops[i], right: 16, left: 'auto', textAlign: 'right' }}>
              {output.label}
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
};
