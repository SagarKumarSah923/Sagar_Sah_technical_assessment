// submit.js — live pipeline counter + submit → backend → result modal
import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import styles from './styles/SubmitButton.module.css';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nodes, edges }),
      });
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => { setResult(null); setError(null); };

  return (
    <>
      <div className={styles.wrapper}>
        {/* Live counter — left column of the 3-column grid */}
        <div className={styles.status}>
          <span className={styles.statChip}>
            <span className={styles.statNum}>{nodes.length}</span>
            <span>nodes</span>
          </span>
          <span className={styles.statSep}>·</span>
          <span className={styles.statChip}>
            <span className={styles.statNum}>{edges.length}</span>
            <span>edges</span>
          </span>
        </div>

        {/* CTA — centre column */}
        <button
          className={styles.btn}
          onClick={handleSubmit}
          disabled={loading}
          type="button"
        >
          {loading ? 'Analysing…' : 'Submit Pipeline'}
        </button>

        {/* Empty right column keeps button centred */}
        <div />
      </div>

      {/* Result / error modal */}
      {(result || error) && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.card} onClick={(e) => e.stopPropagation()}>
            {error ? (
              <>
                <div className={styles.cardTitle}>Connection Error</div>
                <p className={styles.errorMsg}>{error}</p>
              </>
            ) : (
              <>
                <div className={styles.cardTitle}>Pipeline Analysis</div>

                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Nodes</span>
                  <span className={styles.statValue}>{result.num_nodes}</span>
                </div>

                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Edges</span>
                  <span className={styles.statValue}>{result.num_edges}</span>
                </div>

                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Structure</span>
                  <span className={`${styles.dagBadge} ${result.is_dag ? styles.valid : styles.invalid}`}>
                    {result.is_dag ? '✓  Valid DAG' : '✗  Contains Cycle'}
                  </span>
                </div>
              </>
            )}
            <button className={styles.closeBtn} onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};
