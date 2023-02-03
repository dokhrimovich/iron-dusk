import { useEffect, useState, useCallback } from 'react';
import { useIsMounted } from 'common/useIsMounted';

const imageURLs = {
    mud01: 'img/mud01.png',
    grass_back01: 'img/grass_back01.png',
    grass_front01: 'img/grass_front01.png',
    boulder01: 'img/boulder01.png',
    warrior01: 'img/warrior01.png'
};

const mapsURLs = {
    arena01: 'maps/arena01.json'
};

const fetchImg = (name, src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve([name, img]);
        img.onerror = () => resolve([name, src]);
    });
};
const fetchMap = (name, src) => {
    return fetch(src)
        .then(response => response.json())
        .then(data => [name, data]);
};

export const useLoadResources = () => {
    const isMounted = useIsMounted();
    const [timestamp, setTimestamp] = useState(Date.now());
    // const [error, setError] = useState();
    const [images, setImages] = useState();
    const [maps, setMaps] = useState();
    const [isImagesLoading, setIsImagesLoading] = useState(true);
    const [isMapsLoading, setIsMapsLoading] = useState(true);

    const load = useCallback(() => {
        setIsImagesLoading(true);
        setIsMapsLoading(true);

        const imagePromises = Object.entries(imageURLs).map(([name, src]) => fetchImg(name, src));
        const mapPromises = Object.entries(mapsURLs).map(([name, src]) => fetchMap(name, src));

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
                setIsImagesLoading(false);
            });

        Promise.allSettled(mapPromises)
            .then((results) => {
                if (!isMounted()) {
                    return;
                }

                setMaps(Object.fromEntries(
                    results
                        .filter(r => r.status === 'fulfilled')
                        .map(r => r.value)
                ));
                setIsMapsLoading(false);
            });
    }, [setMaps, setIsMapsLoading, setImages, setIsImagesLoading, isMounted]);

    const refresh = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

    useEffect(() => {
        load();
    }, [load, timestamp]);

    return { isLoading: isImagesLoading || isMapsLoading, images, maps, refresh };
};
