import { Link } from 'react-router-dom';
import styles from './homePage.module.css';

export default function HomePage() {

    return (
        <>
        <div className={styles.mainDiv}>
            <div className={styles.columnDiv}>
                <div className={styles.subtaskDiv}>Depth First Search</div>
                <Link to='/graph'>
                    <button className={styles.startButton}>Start</button>
                </Link>
            </div>
            <div className={styles.columnDiv}>
                <div className={styles.subtaskDiv}>Red Black Tree</div>
                <Link to='/tree'>
                    <button className={styles.startButton}>Start</button>
                </Link>
            </div>
        </div>
        <footer className={styles.footer}>
            <span>Internet Of Things</span>
            <span>2022</span>
        </footer>
        </>
    );

}