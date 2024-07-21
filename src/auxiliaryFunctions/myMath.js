export function getDist(node1, node2) {
    return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
}

export const [marginLeft, marginTop, marginRight, marginBottom] = [30, 30, 30, 30];

export function updateNode(node, xDif, yDif) {
    let canvas = document.getElementById('graphCanvas');
    if ((node.x < marginLeft && xDif > 0) || (node.x > canvas.width - marginRight && xDif < 0))
        xDif = 1 * Math.sign(node.x - canvas.width / 2);
    if ((node.y < marginTop && yDif > 0) || (node.y > canvas.height - marginBottom && yDif < 0))
        yDif = 1 * Math.sign(node.y - canvas.height / 2);
    node.x -= xDif;
    node.y -= yDif;
}

// export function xFitsPage(nodeX) {
//     return nodeX > border && nodeX < window.innerWidth - border;
// }

// export function yFitsPage(nodeY) {
//     return nodeY > border && nodeY < window.innerHeight - border;
// }

export function getRepelVec(node1, node2, minDist, neighbor) {
    let dist = getDist(node1, node2);
    let coef = (dist - minDist) / (neighbor ? 50 : 1);
    let xDif = (node1.x - node2.x) * coef / dist;
    let yDif = (node1.y - node2.y) * coef / dist;
    return [xDif, yDif];
}

export function handleRepulsion(node1, node2, minDist, neighbor) {
    let [xDif, yDif] = getRepelVec(node1, node2, minDist, neighbor);
    updateNode(node1, xDif, yDif);
    updateNode(node2, -xDif, -yDif);
}
