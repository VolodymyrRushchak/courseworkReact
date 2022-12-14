import styles from './listEntry.module.css';

export default function ListEntry(props) {
    return (
        <div className={styles.mainDiv}>
            <span className={styles.firstColumn}>{props.id}</span>
            <span className={styles.colon}>:</span>
            <input onChange={props.onChange} id={`neighbors-${props.id}`} className={styles.neighborsColumn}></input>
            <button id={props.id} onClick={props.onDelete} className={styles.deleteButton}>Delete</button>
        </div>
    );
}