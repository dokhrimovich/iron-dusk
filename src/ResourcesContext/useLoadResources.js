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

const sqrt3 = Math.sqrt(3);
const cellWidth = (3 + sqrt3) / 2;
const cellHeight = (sqrt3 + 1) / 2;

/**
 * Will return:
 * 1-st param: offset from center of the cell to the left edge where sprite should be placed.
 * 2-d param: how much sprite will take space horizontally on the canvas.
 * Sprite with width 60px should fill in one cell. Therefor offset for such sprite should be half the width of the cell.
 */
const getSpriteOffsetX = (width) => {
    const ratio = width / 60;
    const onCanvasWidth = cellWidth * ratio;

    return [onCanvasWidth / 2, onCanvasWidth];
};
/**
 * Will return:
 * 1-st param: offset from center of the cell to the top edge where sprite should be placed.
 * 2-d param: how much sprite will take space vertically on the canvas.
 * Sprite with height 68px should fill in one cell. Where middle 34px should fit in the cell
 * and bottom 17px are reserved for overlapping or additional parts to be rendered (like shadow)
 */
const getSpriteOffsetY = (height) => {
    if (height === 34) {
        return [cellHeight/2, cellHeight];
    }

    const ratio = height / 34;
    const onCanvasHeight = (cellHeight) * ratio;

    return [onCanvasHeight - cellHeight, onCanvasHeight];
};

const getImageOffsets = (image) => {
    const [dx, cw] = getSpriteOffsetX(image.width);
    const [dy, ch] = getSpriteOffsetY(image.height);

    return { dx, cw, dy, ch };
};

const fetchImg = (name, src) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve([name, {
            image,
            offsets: getImageOffsets(image)
        }]);
        image.onerror = () => {
            reject([name, src]);
            console.error('Could not load image', [name, src]);
        };
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
