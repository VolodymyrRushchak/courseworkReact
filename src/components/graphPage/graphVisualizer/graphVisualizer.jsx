import { useContext, useEffect } from "react";
import { getObjectFitSize } from "../../../auxiliaryFunctions/getObjectFitSize";
import { marginBottom, marginLeft, marginRight, marginTop } from "../../../auxiliaryFunctions/myMath";
import Canvas from "../../canvas/canvas";
import { GraphContext } from "../graphContext";
import styles from './graphVisualizer.module.css';

export default function GraphVisualizer() {
    const [graph, setGraph] = useContext(GraphContext);

    return (
        <Canvas styles={styles} id="graphCanvas" draw={drawGraph} entity={graph}/>
    );
}

function drawGraph(ctx, graph) {
    for(let [index, node] of Object.entries(graph)){
        node.neighbors.forEach((indx) => {if (+indx > +index) drawEdge(ctx, node, graph[indx])});
        drawNode(ctx, node, index);
    }
}

function drawNode(ctx, node, index) {
    let radius = 18;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(1, 1, 1, 1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `${radius}px Arial`;
    ctx.fillText(index, node.x - radius * 0.3, node.y + radius * 0.3);
}

function drawEdge(ctx, node1, node2) {
    ctx.beginPath();
    ctx.moveTo(node1.x, node1.y);
    ctx.lineTo(node2.x, node2.y);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#f2ffb0";
    ctx.stroke();
}