import { useEffect, useState } from "react";
import { getDist, handleRepulsion } from "../../auxiliaryFunctions/myMath";
import AnimationController from "./animationController/animationController";
import { GraphContext } from "./graphContext";
import GraphVisualizer from "./graphVisualizer/graphVisualizer";
import NodeAdder from "./nodeAdder/nodeAdder";


export default function GraphPage() {
    const [graph, setGraph] = useState({
        '0': {
            x: 450,
            y: 200,
            color: '#32a852',
            neighbors: []
        }
    });
    const [minDist, setMinDist] = useState(150);

    function graphHandler() {
        setGraph(graph => {
            const minRepelDist = 60;
            console.assert(minDist > minRepelDist);

            let xSum = 0;
            let ySum = 0;
            let num = 0;
            let entries = Object.entries(graph);
            for(let [index, node] of entries) {
                node.neighbors.forEach((indx) => {
                    if (+indx > +index) {
                        let node2 = graph[indx];
                        handleRepulsion(node, node2, minDist, true);
                    }
                });
                
                entries.forEach(([index2, node2]) => {
                    if (index2 !== index && getDist(node, node2) < minRepelDist) {
                        handleRepulsion(node, node2, minRepelDist, false);
                    }
                });

                xSum += node.x;
                ySum += node.y;
                num += 1;
            }
            let canvas = document.getElementById('graphCanvas');
            let xDif = canvas.width / 2 - xSum / num;
            let yDif = canvas.height / 2 - ySum / num;
            entries.forEach(([index, node]) => {node.x += xDif/20; node.y += yDif/20;});

            return {...graph};
        });
    }

    useEffect(() => {
        const interval = setInterval(graphHandler, 1000/60);
        return () => clearInterval(interval);
    }, [minDist]);

    return (
        <GraphContext.Provider value={[graph, setGraph]}>
            <AnimationController/>
            <GraphVisualizer/>
            <NodeAdder setMinDist={setMinDist}/>
        </GraphContext.Provider>
    );
}
