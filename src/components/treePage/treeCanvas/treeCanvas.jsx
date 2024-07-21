import { useContext, useEffect } from 'react';
import Canvas from '../../canvas/canvas';
import { TreeContext } from '../treeContext';
import styles from './treeCanvas.module.css';
import { processTree, radius } from '../../../auxiliaryFunctions/treeFunctions';

export default function TreeCanvas() {
    const [tree, setTree, tempTree, setTempTree] = useContext(TreeContext);

    return (
        <Canvas styles={styles} id="treeCanvas" draw={drawTree} entity={tempTree}/>
    );
}

function drawTree(ctx, tree){
    if (tree.root === null)
        return;
    let processedTree = JSON.parse(JSON.stringify(tree));
    processTree(processedTree, processedTree.root);
    drawTreeRecursive(ctx, processedTree, processedTree.root, document.getElementById("treeCanvas").width/2, 40);
    drawPointer(ctx, tree.pointer);
}

function drawTreeRecursive(ctx, tree, value, x, y) {
    if (tree[value].leftChild !== null) {
        let leftx, lefty;
        if (tree.intermediate) {
            leftx = tree[tree[value].leftChild].x;
            lefty = tree[tree[value].leftChild].y;
        } else {
            leftx = x - Math.pow(2, tree[tree[value].leftChild].height - 2) * (2 * radius + 10);
            lefty = y + radius * 2 + 20;
        }
        drawArrow(ctx, x, y, leftx, lefty);
        drawTreeRecursive(ctx, tree, tree[value].leftChild, leftx, lefty);
    }
    if (tree[value].rightChild !== null) { 
        let rightx, righty;
        if (tree.intermediate) {
            rightx = tree[tree[value].rightChild].x;
            righty = tree[tree[value].rightChild].y;
        } else {
            rightx = x + Math.pow(2, tree[tree[value].rightChild].height - 2) * (2 * radius + 10);
            righty = y + radius * 2 + 20;
        }
        drawArrow(ctx, x, y, rightx, righty);
        drawTreeRecursive(ctx, tree, tree[value].rightChild, rightx, righty);
    }
    drawNode(ctx, x, y, tree[value].color === 'red' ? '#ff0000' : '#000000', radius);
    ctx.fillStyle = '#ffffff';
    ctx.font = `${radius}px Arial`;
    ctx.fillText(value, x - radius * 0.3 - (value.toString().length - 1)*4, y + radius * 0.3);
}

function drawNode(ctx, x, y, color, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "rgba(1, 1, 1, 1)";
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawArrow(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#948e41";
    ctx.stroke();
}

function drawPointer(ctx, p) {
    if(p === null)
        return;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius + 10, 0, 2 * Math.PI);
    ctx.strokeStyle = "#f5f542";
    ctx.lineWidth = 2;
    ctx.stroke();
}