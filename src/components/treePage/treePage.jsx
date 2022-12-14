import { useEffect, useState } from "react";
import TreeCanvas from "./treeCanvas/treeCanvas";
import { TreeContext } from "./treeContext";
import TreeController from "./treeController/treeController";

export default function TreePage() {
    const [tree, setTree] = useState({
        root: null,
        pointer: null,
        intermediate: false
    });

    const [tempTree, setTempTree] = useState({
        root: null,
        pointer: null,
        intermediate: false,
    });

    return (
        <TreeContext.Provider value={[tree, setTree, tempTree, setTempTree]}>
            <TreeController/>
            <TreeCanvas/>
        </TreeContext.Provider>
    );
}