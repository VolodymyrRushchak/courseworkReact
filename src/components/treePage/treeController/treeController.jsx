import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TreeContext } from '../treeContext';
import styles from './treeController.module.css';
import { createNode, processTree, insertRecursive, prepareTree, interpolate, getRootCoords, equalise } from '../../../auxiliaryFunctions/treeFunctions';

export default function TreeController() {
    const [tree, setTree, tempTree, setTempTree] = useContext(TreeContext);

    function insert(value, stepsCount) {
        const returnObj = {value: false, newTree: null};
        const treeCopy = JSON.parse(JSON.stringify(tree));
        if (treeCopy.root === null) {
            treeCopy.root = value;
            treeCopy[value] = createNode(null, 'black');
            returnObj.value = true;
            returnObj.newTree = treeCopy;
        } else {
            const result = insertRecursive(treeCopy, treeCopy.root, value, stepsCount, {value: 0});
            if (treeCopy[treeCopy.root].parrent !== null)
                treeCopy.root = treeCopy[treeCopy.root].parrent;
            if (result === 'okay') {
                returnObj.value = true;
                returnObj.newTree = treeCopy;
            } else {
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
                        processTree(treeCopy, treeCopy.root);
                        prepareTree(treeCopy, treeCopy.root, getRootCoords().x, getRootCoords().y);
                        equalise(tempTree, treeCopy);
                        let interpolatedTree = interpolate(tempTree, treeCopy, counter);
                        return interpolatedTree;
                    });
                    if (counter >= 19) {
                        clearInterval(interval);
                    }
                },  20);
            }
        }
        
        if (returnObj.newTree !== null) {
            setTree(returnObj.newTree);
            returnObj.newTree.intermediate = false;
            setTempTree(JSON.parse(JSON.stringify(returnObj.newTree)));
        }
        return returnObj.value;
    }

    function deleteBranch(value){

    }

    return (
        <div className={styles.mainDiv}>
            <div className={styles.subDiv}>
                <input id='insertInput' className={styles.input} type="number" />

                <button onClick={() => {
                    const newValue = parseFloat(document.getElementById("insertInput").value);
                    let stepsCount = 1;
                    const interval = setInterval(() => {
                        if(insert(newValue, stepsCount)) 
                            clearInterval(interval);
                        stepsCount += 1;
                    }, 1000);
                }

                } className={styles.button}>Insert</button>
            </div>
            <div className={styles.subDiv}>
                <input id='deleteInput' className={styles.input} type="number" />

                <button onClick={() => deleteBranch(parseFloat(document.getElementById("insertInput").value))}

                className={styles.button}>Delete</button>
            </div>
            <div className={styles.subDiv}>
                <input id='findInput' className={styles.input} type="number" />
                <button className={styles.button}>Find</button>
            </div>
            <Link to='/'>
                <button className={styles.homeBtn}>Home</button>
            </Link>
        </div>
    );
}
