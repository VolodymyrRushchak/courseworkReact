export const radius = 15;
export const counterMax = 20;

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
    if(leftRight !== null)
        tree[leftRight].parrent = index;
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
    if(rightLeft !== null)
        tree[rightLeft].parrent = index;
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

export function getSibling(tree, index, parrent=null) {
    const p = parrent === null ? tree[index].parrent : parrent;
    return tree[p].leftChild === index ? tree[p].rightChild : tree[p].leftChild;
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
            node.x += xdif / (counterMax - counter);
            node.y += ydif / (counterMax - counter);
        }
        node.color = tree1[index].color;
    }
    if(tree1.pointer === null)
        pointer = null;
    else {
        const [xdif, ydif] = difference(pointer, tree1.pointer);
        pointer.x += xdif / (counterMax - counter);
        pointer.y += ydif / (counterMax - counter);
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
    Object.keys(tree1).forEach(key => {
        if(!Object.keys(tree2).includes(key))
            delete tree1[key];
    });
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

export function deleteRecursive(tree, index, value, stepsCount, currStep){
    let result = 'okay';
    if(index === null) 
        return result;
    tree[index].current = true;
    if(currStep.value >= stepsCount)
        return 'break';
    tree[index].current = false;
    if(value !== index) {
        const child = value > index ? tree[index].rightChild : tree[index].leftChild;
        currStep.value += 1;
        const returnState = deleteRecursive(tree, child, value, stepsCount, currStep);
        if(returnState === 'break')
            return 'break';
        if(returnState === 'doubleblack'){
            const parrent = tree[index].parrent;
            result = parrent === null ? 'okay' : fixBlackCase(tree, index, parrent);
        }
        return result;
    } 
    else{
        let temp = undefined;
        if(tree[index].leftChild === null){
            temp = tree[index].rightChild;
            if(temp !== null)    
                tree[temp].parrent = tree[index].parrent;
        } else
        if(tree[index].rightChild === null){
            temp = tree[index].leftChild;
            tree[temp].parrent = tree[index].parrent;
        }
        if(temp !== undefined){
            const cur_color = tree[index].color;
            const parrent = tree[index].parrent;
            let done = false;
            if(temp !== null && (tree[index].color === 'red' || tree[temp].color === 'red')){
                tree[temp].color = 'black';
                done = true;
            }
            fixParent(tree, temp, index);
            delete tree[index];            
            if(tree.root === index){
                tree.root = temp;
                return result;
            }
            if(!done && cur_color === 'black' && (temp === null || tree[temp].color === 'black')){
                result = fixBlackCase(tree, temp, parrent, stepsCount, currStep);
            }
            return result;
        }
        temp = minValueBranch(tree, tree[index].rightChild);
        currStep.value += 1;
        result = deleteRecursive(tree, tree[index].rightChild, temp, stepsCount, currStep);
        if(result === 'break')
            return 'break';
        tree[temp] = {...tree[index]};
        fixParent(tree, temp, index);
        delete tree[index];
        if(tree[temp].rightChild !== null)
            tree[tree[temp].rightChild].parrent = temp;
        tree[tree[temp].leftChild].parrent = temp;
        if(tree.root === index){
            tree.root = temp;
            return 'okay';
        }
        if(result === 'doubleblack')
            result = fixBlackCase(tree, temp, tree[temp].parrent, stepsCount, currStep);
        return result;
    }
}

export function findRecursive(tree, index, value, stepsCount, currStep){
    if(index === null) return 'okay';
    tree[index].current = true;
    if(currStep.value >= stepsCount)
        return 'break';
    tree[index].current = false;
    currStep.value += 1;
    if(value < index){ 
        if(findRecursive(tree, tree[index].leftChild, value, stepsCount, currStep) === 'break')
            return 'break';
    }
    else if(value > index){
        if(findRecursive(tree, tree[index].rightChild, value, stepsCount, currStep) === 'break')
            return 'break';
    }
    return 'okay';
}

function minValueBranch(tree, index) {
    let current = index;
    while(tree[current].leftChild !== null){
        current = tree[current].leftChild;
    }
    return current
}

function fixBlackCase(tree, index, parrent, stepsCount, currStep){
    const sibling = getSibling(tree, index, parrent);
    currStep.value += 1;
    if(tree[sibling].color === 'black'){ // black sibling
        // red children case
        const redChildPos = getRedChildPos(tree, sibling);
        if(tree[parrent].leftChild === sibling && (redChildPos === 'left' || redChildPos === 'both')){ // left left case
            tree[tree[sibling].leftChild].color = 'black';
            rotateRight(tree, parrent);
        } 
        else if(tree[parrent].leftChild === sibling && redChildPos === 'right'){ // left right case
            tree[tree[sibling].rightChild].color = 'black';
            rotateLeft(tree, sibling);
            rotateRight(tree, parrent);
        }
        else if(tree[parrent].rightChild === sibling && (redChildPos === 'right' || redChildPos === 'both')){ // right right case
            tree[tree[sibling].rightChild].color = 'black';
            rotateLeft(tree, parrent);
        }
        else if(tree[parrent].rightChild === sibling && redChildPos === 'left'){ // right left case
            tree[tree[sibling].leftChild].color = 'black';
            rotateRight(tree, sibling);
            rotateLeft(tree, parrent);
        }
        // all childrens are black case
        else if(allChildsBlack(tree, sibling)){
            tree[sibling].color = 'red';
            if(tree[parrent].color === 'black' && currStep.value < stepsCount)
                return 'doubleblack';
            tree[parrent].color = 'black';
        }
        if(currStep.value >= stepsCount)
            return 'break';
        return 'okay';
    }
    else { // red sibling
        [tree[parrent].color, tree[sibling].color] = [tree[sibling].color, tree[parrent].color];
        if(tree[parrent].leftChild === sibling) // left case
            rotateRight(tree, parrent);
        else // right case
            rotateLeft(tree, parrent);
        if(currStep.value >= stepsCount)
            return 'break';
        return fixBlackCase(tree, index, parrent, stepsCount, currStep);
    }
}

function getRedChildPos(tree, index){
    let result = 'none';
    if(tree[index].leftChild !== null && tree[tree[index].leftChild].color === 'red')
        result = 'left';
    if(tree[index].rightChild !== null && tree[tree[index].rightChild].color === 'red')
        result = result === 'left' ? 'both' : 'right';
    return result;
}

function fixParent(tree, newVal, oldVal){
    if(tree[oldVal].parrent === null)
        return;
    if(tree[tree[oldVal].parrent].rightChild === oldVal)
        tree[tree[oldVal].parrent].rightChild = newVal;
    else 
        tree[tree[oldVal].parrent].leftChild = newVal;
}

function allChildsBlack(tree, index){
    const leftBlack = tree[index].leftChild === null || tree[tree[index].leftChild].color === 'black';
    const rightBlack = tree[index].rightChild === null || tree[tree[index].rightChild].color === 'black';
    return leftBlack && rightBlack;
}