import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraphContext } from '../graphContext';
import styles from './animationController.module.css';

export default function AnimationController() {
    const [stepsCount, setStepsCount] = useState(0);
    const [intervalId, setIntervalId] = useState(0);
    const [paused, setPaused] = useState(true);
    const [graph, setGraph] = useContext(GraphContext);
    let [startingNode, setStartingNode] = useState('null');

    function handleAnimation() {
        const visitedNodes = [];
        const stack = [startingNode];

        setStepsCount(stepsCount => {
            while (stack.length !== 0 && visitedNodes.length < stepsCount) {
                let curNode = stack.pop();
                visitedNodes.push(curNode);
                for (let node of graph[curNode].neighbors) {
                    if (!(visitedNodes.includes(node) || stack.includes(node))) {
                        stack.push(node);
                    }
                }
            }
            paintGraph(graph, visitedNodes, stack);

            return stepsCount < Object.keys(graph).length ? stepsCount + 1 : stepsCount;
        });

        setGraph(graph);
    }

    function paintGraph(graph, visitedNodes, stack) {
        for (const [index, node] of Object.entries(graph)){
            if (visitedNodes.includes(index)) {
                node.color = '#ff3b3b';
            } else if (stack.includes(index)) {
                node.color = '#ffae00';
            } else {
                node.color = '#32a852';
            }
        }
    }

    return (
        <div className={styles.mainDiv}>
            <button onClick={() => {
                if (paused) {
                    let newStart = startingNode;
                    if (startingNode === 'null') {
                        newStart = prompt('Type in an index of the starting node:');
                        setStartingNode(newStart);
                    }
                    startingNode = newStart;
                    setIntervalId(setInterval(handleAnimation, 1000));
                    setPaused(false);
                }
            }} className={styles.controlButton}>Start</button>
            <button onClick={() => {
                if (!paused) {
                    clearInterval(intervalId);
                    setPaused(true);
                }
            }} className={styles.controlButton}>Stop</button>
            <button onClick={() => {
                setStepsCount(stepsCount => stepsCount > 0 ? stepsCount - 2 : stepsCount);
                handleAnimation();
            }} className={styles.controlButton}>Back</button>
            <Link to='/'>
                <button className={styles.controlButton}>Home</button>
            </Link>
        </div>
    );
}