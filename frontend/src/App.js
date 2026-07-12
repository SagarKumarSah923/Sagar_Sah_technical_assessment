import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import styles from './styles/App.module.css';

function App() {
  return (
    /* Full-screen column layout: toolbar → canvas → submit bar */
    <div className={styles.app}>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
