// textNode.js
// Holds a static or templated text value. Supports {{ varName }} syntax to
// create live input handles, and auto-resizes in both width and height.

import { useState, useEffect, useRef, useCallback } from 'react';
import { BaseNode } from './BaseNode';

// Matches {{ validJsIdentifier }} — same naming rules as JS variables
const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const MIN_WIDTH = 220;

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText]   = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [nodeWidth, setNodeWidth] = useState(MIN_WIDTH);

  const textareaRef = useRef(null);
  // Hidden span used to measure the pixel width of the longest text line
  const mirrorRef   = useRef(null);

  // Returns a deduped array of valid variable names found in the text
  const extractVars = useCallback((text) => {
    const found = new Set();
    let m;
    const rx = new RegExp(VAR_REGEX.source, 'g');
    while ((m = rx.exec(text)) !== null) found.add(m[1]);
    return [...found];
  }, []);

  useEffect(() => {
    // Auto-grow height: reset to 'auto' first so shrinking works too
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    }

    // Compute variables first so we know whether the handle-label zone is active
    const vars = extractVars(currText);

    // Auto-grow width via mirror span
    const mirror = mirrorRef.current;
    if (mirror) {
      const longestLine = currText
        .split('\n')
        .reduce((a, b) => (a.length > b.length ? a : b), '');
      mirror.textContent = longestLine || ' ';

      // When variable handles exist (>1 needed for labels, but even 1 var is labelled
      // because the name is semantically meaningful), BaseNode adds 54 px left padding.
      // We compensate so the textarea isn't squeezed below a comfortable width.
      const labelZone = vars.length > 0 ? 54 : 0;
      setNodeWidth(Math.max(MIN_WIDTH, mirror.offsetWidth + 24 + labelZone + 24));
    }

    setVariables(vars);
  }, [currText, extractVars]);

  // Each detected variable becomes a named target handle on the left edge.
  // We keep labels even for a single variable because the name matters to the user.
  const inputs = variables.map((v) => ({ id: `${id}-${v}`, label: v }));

  return (
    <BaseNode
      title="Text"
      icon="T"
      color="#27ae60"
      inputs={inputs}
      outputs={[{ id: `${id}-output` }]}
      style={{ width: nodeWidth }}
      showLabels
    >
      {/* Mirror span: position:absolute + visibility:hidden keeps it out of layout */}
      <span
        ref={mirrorRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          fontSize: 12,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          pointerEvents: 'none',
          top: 0,
          left: 0,
        }}
      />

      <label>
        Text:
        <textarea
          ref={textareaRef}
          value={currText}
          onChange={(e) => setCurrText(e.target.value)}
          rows={1}
          style={{
            resize: 'none',     /* JS controls size — manual resize fights the effect */
            overflow: 'hidden', /* hides scrollbar during the height-auto reset frame */
          }}
        />
      </label>
    </BaseNode>
  );
};
