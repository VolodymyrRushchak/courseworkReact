import { useEffect } from "react";
import { getObjectFitSize } from "../../auxiliaryFunctions/getObjectFitSize";

export default function Canvas(props) {
    useEffect(() => {
        const canvas = document.getElementById(props.id);
        let dimensions = getObjectFitSize(
            true,
            canvas.clientWidth,
            canvas.clientHeight,
            canvas.width,
            canvas.height
        );
        canvas.width = dimensions.width * 1.2;
        canvas.height = dimensions.height;
    }, []);

    useEffect(() => {
        const canvas = document.getElementById(props.id);
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(1, 1);
        props.draw(ctx, props.entity);
    });

    return (
        <canvas className={props.styles.canvas} id={props.id}></canvas>
    );
}