import { useEffect, useState, useCallback } from 'react';
import { useResourcesContext, SET_IMAGES, SET_MAPS, SET_IS_LOADING } from 'Context/ResourcesContext';

import { terrainElements } from 'GameElements/TerrainElements';

const imageURLs = {
    activeCharacterMarkerBack: 'img/activeCharacterMarkerBack.png',
    activeCharacterMarkerFront: 'img/activeCharacterMarkerFront.png',
    mud01: 'img/mud01.png',
    mud02: 'img/mud02.png',
    mud03: 'img/mud03.png',
    tallGrassBack01: 'img/tallGrassBack01.png',
    tallGrassFront01: 'img/tallGrassFront01.png',
    boulder01: 'img/boulder01.png',
    warrior01: 'img/warrior01.png'
};

const mapsURLs = {
    arena01: 'maps/arena01.json'
};

const fetchImg = (name, src) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve([name, image]);
        image.onerror = () => {
            reject([name, src]);
            console.error('Could not load image', [name, src]);
        };
    });
};

const enhanceMap = (map) => {
    const { groundLayer, terrainLayer, noGoCodes, mapCodes } = map;
    const getEl = (code) => mapCodes[code] && terrainElements[mapCodes[code]]() || null;

    return {
        ...map,
        groundLayer: groundLayer.map(row => row.map(code => getEl(code))),
        terrainLayer: terrainLayer.map(row => row.map(code => getEl(code))),
        isNoGoCell: ([ri, ci]) => {
            const groundCode = groundLayer[ri]?.[ci];
            const terrainCode = terrainLayer[ri]?.[ci];

            if (groundCode === undefined || terrainCode === undefined) {
                return false;
            }

            return groundCode === 0 || noGoCodes.includes(groundCode) || noGoCodes.includes(terrainCode);
        }
    };
};

const fetchMap = (name, src) => {
    return fetch(src)
        .then(response => response.json())
        .then(data => [name, enhanceMap(data)]);
};

export const useLoadResources = () => {
    const { dispatch } = useResourcesContext();
    const [timestamp, setTimestamp] = useState(Date.now());
    // const [error, setError] = useState();
    const [isImagesLoading, setIsImagesLoading] = useState(true);
    const [isMapsLoading, setIsMapsLoading] = useState(true);

    const load = useCallback(() => {
        setIsImagesLoading(true);
        setIsMapsLoading(true);

        const imagePromises = Object.entries(imageURLs).map(([name, src]) => fetchImg(name, src));
        const mapPromises = Object.entries(mapsURLs).map(([name, src]) => fetchMap(name, src));

        Promise.allSettled(imagePromises)
            .then((results) => {
                const images = (Object.fromEntries(
                    results
                        .filter(r => r.status === 'fulfilled')
                        .map(r => r.value)
                ));

                dispatch({
                    type: SET_IMAGES,
                    images
                });
                setIsImagesLoading(false);
            });

        Promise.allSettled(mapPromises)
            .then((results) => {
                const maps = Object.fromEntries(
                    results
                        .filter(r => r.status === 'fulfilled')
                        .map(r => r.value)
                );

                dispatch({
                    type: SET_MAPS,
                    maps
                });
                setIsMapsLoading(false);
            });
    }, [dispatch, setIsMapsLoading, setIsImagesLoading]);

    const refresh = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

    useEffect(() => {
        load();
    }, [load, timestamp]);

    useEffect(() => {
        dispatch({
            type: SET_IS_LOADING,
            isLoading: isMapsLoading || isImagesLoading
        });
    }, [dispatch, isImagesLoading, isMapsLoading]);

    return refresh;
};
