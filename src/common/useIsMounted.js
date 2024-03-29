import { useEffect, useRef, useCallback } from 'react';

export const useIsMounted = () => {
    const isMounted = useRef();

    useEffect(() => {
        isMounted.current = true;

        return () => isMounted.current = false;
    }, []);

    return useCallback(() => isMounted.current, []);
};
