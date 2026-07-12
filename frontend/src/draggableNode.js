// draggableNode.js
import styles from './styles/DraggableNode.module.css';

export const DraggableNode = ({ type, label, color, icon }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={styles.chip}
      style={{ '--chip-color': color }}
      draggable
      onDragStart={onDragStart}
    >
      {/* Colored icon badge — background tinted with the node's accent color */}
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
    </div>
  );
};
