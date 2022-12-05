export const radius = 15;

export function rotateRight(tree, index) {
    if (tree[index].parrent !== null) {
        if (tree[tree[index].parrent].leftChild === index) {
            tree[tree[index].parrent].leftChild = tree[index].leftChild;
        } else {
            tree[tree[index].parrent].rightChild = tree[index].leftChild;
        }
    }
    tree[tree[index].leftChild].parrent = tree[index].parrent;
    let leftRight = tree[tree[index].leftChild].rightChild;
    tree[tree[index].leftChild].rightChild = index;
    tree[index].parrent = tree[index].leftChild;
    tree[index].leftChild = leftRight;
}

export function rotateLeft(tree, index) {
    if (tree[index].parrent !== null) {
        if (tree[tree[index].parrent].leftChild === index) {
            tree[tree[index].parrent].leftChild = tree[index].rightChild;
        } else {
            tree[tree[index].parrent].rightChild = tree[index].rightChild;
        }
    }
    tree[tree[index].rightChild].parrent = tree[index].parrent;
    let rightLeft = tree[tree[index].rightChild].leftChild;
    tree[tree[index].rightChild].leftChild = index;
    tree[index].parrent = tree[index].rightChild;
    tree[index].rightChild = rightLeft;
}

export function createNode(parrent, color='red') {
    return {
        color: color,
        current: false,
        parrent: parrent,
        leftChild: null,
        rightChild: null
    };
}

export function getSibling(tree, index) {
    return tree[tree[index].parrent].leftChild === index ? tree[tree[index].parrent].rightChild : tree[tree[index].parrent].leftChild;
}

export function processTree(tree, value) {
    if (value === null)
        return 0;
    let leftChildHeight = processTree(tree, tree[value].leftChild);
    let rightChildHeight = processTree(tree, tree[value].rightChild);
    tree[value].height = Math.max(leftChildHeight, rightChildHeight) + 1;
    return tree[value].height;
}

export function insertRecursive(tree, index, value, stepsCount, currStep) {
    if (index === null)
        return 'null';
    tree[index].current = true;
    if (currStep.value >= stepsCount)
        return 'break';

    let status;
    let side;
    tree[index].current = false;
    currStep.value += 1;
    if (value < index) {
        side = 'left';
        status = insertRecursive(tree, tree[index].leftChild, value, stepsCount, currStep);
        if (status === 'null'){
            tree[index].leftChild = value;
            tree[value] = createNode(index);
        }
    } else {
        side = 'right';
        status = insertRecursive(tree, tree[index].rightChild, value, stepsCount, currStep);
        if (status === 'null'){
            tree[index].rightChild = value;
            tree[value] = createNode(index);
        }
    }

    if (status === 'break' || currStep.value >= stepsCount)
        return 'break';

    if (status === 'recolored2' && tree[index].parrent !== null) return 'recolored';
    if (status !== 'okay') {
        if ((status === 'recolored' || status === 'recolored2') && tree[index].parrent === null) { 
            tree[index].color = 'black';
            return 'okay';
        } 
        if (tree[index].color === 'red') {
            let uncle = getSibling(tree, index);
            currStep.value += 1;
            if (uncle !== null && tree[uncle].color === 'red') {
                tree[index].color = tree[uncle].color = 'black';
                tree[tree[index].parrent].color = 'red';
                return 'recolored2';
            } else {
                if(index === tree[tree[index].parrent].leftChild && side === 'left'){ //left left case
                    let grandpa = tree[index].parrent;
                    rotateRight(tree, grandpa);
                    [tree[grandpa].color, tree[index].color] = [tree[index].color, tree[grandpa].color];
                } else 
                if(index === tree[tree[index].parrent].rightChild && side === 'left'){ //right left case
                    let grandpa = tree[index].parrent;
                    rotateRight(tree, index);
                    rotateLeft(tree, grandpa);
                    [tree[grandpa].color, tree[tree[index].parrent].color] = [tree[tree[index].parrent].color, tree[grandpa].color];
                } else
                if(index === tree[tree[index].parrent].leftChild && side === 'right'){ //left right case
                    let grandpa = tree[index].parrent;
                    rotateLeft(tree, index);
                    rotateRight(tree, grandpa);
                    [tree[grandpa].color, tree[tree[index].parrent].color] = [tree[tree[index].parrent].color, tree[grandpa].color];
                } else
                if(index === tree[tree[index].parrent].rightChild && side === 'right'){ //right right case
                    let grandpa = tree[index].parrent;
                    rotateLeft(tree,  grandpa);
                    [tree[grandpa].color, tree[index].color] = [tree[index].color, tree[grandpa].color];
                } 
                return 'okay';
            }
        }
    }
    return 'okay';
}

export function prepareTree(tree, index, x, y) {
    [tree[index].x, tree[index].y] = [x, y];
    if (tree[index].current === true)
        tree.pointer = {x: x, y: y};
    if (tree[index].leftChild !== null) {
        let leftx = x - Math.pow(2, tree[tree[index].leftChild].height - 2) * (2 * radius + 10);
        let lefty = y + radius * 2 + 20;
        prepareTree(tree, tree[index].leftChild, leftx, lefty);
    }
    if (tree[index].rightChild !== null) {
        let rightx = x + Math.pow(2, tree[tree[index].rightChild].height - 2) * (2 * radius + 10);
        let righty = y + radius * 2 + 20;
        prepareTree(tree, tree[index].rightChild, rightx, righty);
    }
}

export function interpolate(tree0, tree1, counter) {
    const resultTree = JSON.parse(JSON.stringify(tree0));
    let pointer = {...resultTree.pointer};
    const root = resultTree.root;

    delete resultTree.pointer;
    delete resultTree.root;
    delete resultTree.intermediate;
    
    for(const [index, node] of Object.entries(resultTree)){
        if(node.x !== tree1[index].x || node.y !== tree1[index].y) {
            const [xdif, ydif] = difference(node, tree1[index]);
            node.x += xdif / (20 - counter);
            node.y += ydif / (20 - counter);
        }
        node.color = tree1[index].color;
    }
    if(tree1.pointer === null)
        pointer = null;
    else {
        const [xdif, ydif] = difference(pointer, tree1.pointer);
        pointer.x += xdif / (20 - counter);
        pointer.y += ydif / (20 - counter);
    }
    resultTree.pointer = pointer;
    resultTree.intermediate = true;
    resultTree.root = root;
    return resultTree;
}

function difference(branch1, branch2) {
    return [branch2.x - branch1.x, branch2.y - branch1.y];
}

export function getRootCoords() {
    return {x: document.getElementById("treeCanvas").width/2, y: 40};
}

export function equalise(tree1, tree2) {
    const copy = JSON.parse(JSON.stringify(tree2));
    delete copy.intermediate;
    delete copy.root;
    delete copy.pointer;
    for(const [index, node] of Object.entries(copy)) {
        let nI = parseFloat(index);
        if(!Object.keys(tree1).includes(index)){
            tree1[index] = {...node};
            if(tree2[node.parrent].rightChild === nI)
                tree1[node.parrent].rightChild = nI;
            else
                tree1[node.parrent].leftChild = nI;
        } else {
            tree1[index].parrent = node.parrent;
            tree1[index].leftChild = node.leftChild;
            tree1[index].rightChild = node.rightChild;
        }
    }
    if (tree1[tree1.root].parrent !== null ) {
        tree1.root = tree1[tree1.root].parrent;
    }
}

function fixRedRed() {
    
}