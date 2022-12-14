import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TreeContext } from '../treeContext';
import styles from './treeController.module.css';
import { createNode, processTree, insertRecursive, prepareTree, interpolate, getRootCoords, equalise, deleteRecursive, counterMax, findRecursive } from '../../../auxiliaryFunctions/treeFunctions';

export default function TreeController() {
    const [tree, setTree, tempTree, setTempTree] = useContext(TreeContext);

    function insert(value, stepsCount) {
        let returnState = false;
        const treeCopy = JSON.parse(JSON.stringify(tree));
        if (treeCopy.root === null) {
            treeCopy.root = value;
            treeCopy[value] = createNode(null, 'black');
            returnState = true;
        } else {
            const result = insertRecursive(treeCopy, treeCopy.root, value, stepsCount, {value: 0});
            if (treeCopy[treeCopy.root].parrent !== null)
                treeCopy.root = treeCopy[treeCopy.root].parrent;
            if (result === 'okay') {
                returnState = true;
            } else {
                animateTransformation(treeCopy);
            }
        }
        if (returnState) {
            setTree(treeCopy);
            treeCopy.intermediate = false;
            setTempTree(JSON.parse(JSON.stringify(treeCopy)));
        }
        return returnState;
    }

    function deleteBranch(value, stepsCount){
        const treeCopy = JSON.parse(JSON.stringify(tree));
        const result = deleteRecursive(treeCopy, treeCopy.root, value, stepsCount, {value: 0});
        if(treeCopy.root !== null && treeCopy[treeCopy.root].parrent !== null)
            treeCopy.root = treeCopy[treeCopy.root].parrent;
        if (result === 'okay') {
            setTree(treeCopy);
            treeCopy.intermediate = false;
            setTempTree(JSON.parse(JSON.stringify(treeCopy)));
            return true;
        } else {
            animateTransformation(treeCopy);
            return false;
        }
    }

    function find(value, stepsCount){
        const treeCopy = JSON.parse(JSON.stringify(tree));
        const result = findRecursive(treeCopy, treeCopy.root, value, stepsCount, {value: 0});
        if (result === 'okay') {
            treeCopy.intermediate = false;
            setTempTree(treeCopy);
            return true;
        } else {
            animateTransformation(treeCopy);
            return false;
        }
    }

    function animateTransformation(goalTree){
        let counter = -1;
        const interval = setInterval(() => {
            counter += 1;
            setTempTree(tempTree => {
                if(!tempTree.intermediate) {
                    processTree(tempTree, tempTree.root);
                    prepareTree(tempTree, tempTree.root, getRootCoords().x, getRootCoords().y);
                }
                if(tempTree.pointer === null)
                    tempTree.pointer = getRootCoords();
                processTree(goalTree, goalTree.root);
                prepareTree(goalTree, goalTree.root, getRootCoords().x, getRootCoords().y);
                equalise(tempTree, goalTree);
                let interpolatedTree = interpolate(tempTree, goalTree, counter);
                return interpolatedTree;
            });
            if (counter >= counterMax - 1) {
                clearInterval(interval);
            }
        },  20);
    }

    function onAction(action, fieldName){
        const value = parseFloat(document.getElementById(fieldName).value);
        let stepsCount = 1;
        const interval = setInterval(() => {
            if(action(value, stepsCount)) 
                clearInterval(interval);
            stepsCount += 1;
        }, 1000);
    }

    return (
        <div className={styles.mainDiv}>
            <div className={styles.subDiv}>
                <input id='insertInput' className={styles.input} type="number" />
                <button onClick={() => onAction(insert, "insertInput")} className={styles.button}>Insert</button>
            </div>
            <div className={styles.subDiv}>
                <input id='deleteInput' className={styles.input} type="number" />
                <button onClick={() => onAction(deleteBranch, "deleteInput")} className={styles.button}>Delete</button>
            </div>
            <div className={styles.subDiv}>
                <input id='findInput' className={styles.input} type="number" />
                <button onClick={() => onAction(find, "findInput")} className={styles.button}>Find</button>
            </div>
            <Link to='/'>
                <button className={styles.homeBtn}>Home</button>
            </Link>
        </div>
    );
}
