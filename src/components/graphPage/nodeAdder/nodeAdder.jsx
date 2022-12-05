import { useContext, useState } from "react";
import { GraphContext } from "../graphContext";
import ListEntry from "./listEntry/listEntry";
import styles from "./nodeAdder.module.css";

export default function NodeAdder(props) {
    const [nodes, setNodes] = useState([0]);
    const [idHolder, setIdHolder] = useState(1);
    const [graph, setGraph] = useContext(GraphContext);
    
    function updateGraph() {
        const newGraph = {};
        props.setMinDist(100 + 10*nodes.length);
        for(let node of nodes.map((n) => n.toString())) {
            let nodeNeighbors = document.getElementById(`neighbors-${node}`).value.replace(/\s+/g, '').split(',');
            if (nodeNeighbors.at(-1) === ''){
                nodeNeighbors.pop();
            }
            let [newx, newy] = Object.keys(graph).includes(node) ? [graph[node].x, graph[node].y] : [450 + Math.random()*100 - 50, 200 + Math.random()*100 - 50];
            newGraph[node] = {
                x: newx,
                y: newy,
                color: '#32a852',
                neighbors: nodeNeighbors
            };
        }
        correctGraph(newGraph);
        setGraph(newGraph);
    }   

    function deleteNode(event){
        let source_id = parseInt((event.target || event.srcElement).id);
        setNodes(nodes => {
            nodes.splice(nodes.indexOf(source_id), 1);
            return [...nodes];
        });
        setTimeout(updateGraph, 10);
    }
    
    return (
        <>
        <div className={styles.headers}>
            <span className={styles.name}>Node</span>
            <span className={styles.neighbors}>Node neighbors</span>
        </div>
        {nodes.map((node) => <ListEntry onChange={updateGraph} onDelete={deleteNode} key={node} id={node}/>)}
        <button onClick={() => {
            nodes.push(idHolder);
            setNodes([...nodes]);
            setIdHolder(idHolder + 1);
        }} 
        className={styles.addNodeButton}>Add new node</button>
        </>
    );
}

function correctGraph(graph) {
    //Check for mutual neighborhood and not existing neighbors
    Object.entries(graph).forEach(([index, node]) => {
        node.neighbors.forEach((neighbor) => {
            if (!Object.keys(graph).includes(neighbor)){
                node.neighbors.splice(node.neighbors.indexOf(neighbor), 1);
                document.getElementById(`neighbors-${index}`).value = node.neighbors.toString();
            }
            else if (!graph[neighbor].neighbors.includes(index)){
                graph[neighbor].neighbors.push(index);
                let neighbors_input = document.getElementById(`neighbors-${neighbor}`);
                if (neighbors_input.value.length !== 0)
                    neighbors_input.value += ', ';
                neighbors_input.value += `${index}`;
            }
        });
    });
    //Check for empty neighbors
    Object.entries(graph).forEach(([index, node]) => {
        if (node.neighbors.length === 0)
            delete graph[index];
    });
}