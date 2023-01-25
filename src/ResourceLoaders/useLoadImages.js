import { useIsMounted } from 'common/useIsMounted';
import { useEffect, useState, useCallback } from 'react';

const imageURLs = {
    mud01: 'img/mud01.png',
    grass_back01: 'img/grass_back01.png',
    grass_front01: 'img/grass_front01.png',
    boulder01: 'img/boulder01.png',
    warrior01: 'img/warrior01.png'
};

const fetchImg = (name, src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve([name, img]);
        img.onerror = () => resolve([name, src]);
    });
};

export const useLoadImages = () => {
    const isMounted = useIsMounted();
    const [timestamp, setTimestamp] = useState(Date.now());
    // const [error, setError] = useState();
    const [images, setImages] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const load = useCallback(() => {
        setIsLoading(true);

        const imagePromises = Object.entries(imageURLs).map(([name, src]) => fetchImg(name, src));

        Promise.allSettled(imagePromises)
            .then((results) => {
                if (!isMounted()) {
                    return;
                }

                setImages(Object.fromEntries(
                    results
                        .filter(r => r.status === 'fulfilled')
                        .map(r => r.value)
                ));
                setIsLoading(false);
            });
    }, [setImages, setIsLoading, isMounted]);

    const refresh = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

    useEffect(() => {
        load();
    }, [load, timestamp]);

    return { isLoading, images, refresh };
};
