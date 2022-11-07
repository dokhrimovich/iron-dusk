import { useCallback, useEffect, useState } from 'react';
import {useFindClosesCell} from "./useFindClosesCell";

export const useClickOnCell = ({ skeleton, canvas, scale }) => {
    const [cell, setCell] = useState(null);
    const findClosesCell = useFindClosesCell(skeleton, scale);

    const onClick = useCallback((event) => {
        const { left, top } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;

        setCell(findClosesCell(x, y));
    }, [setCell, findClosesCell]);

    useEffect(() => {
        if (!canvas) {
            return;
        }

        canvas?.addEventListener?.('click', onClick);

        return () => {
            canvas?.removeEventListener?.('click', onClick);
        }
    }, [onClick, canvas]);

    return cell;
};
