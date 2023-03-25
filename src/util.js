// Given two points (x1, y1), (x2, y2) and a new y3 value,
// find x3 so that 3 points on same line.
// Using slope equation,
// (x3-x1) / (y3-y1) = (x2-x1) / (y2-y1)
function findXFrom2PointsOnOneLineAndY(x1, y1, x2, y2, y3) {
    if (y1 === y2) return NaN;

    return (y3 - y1) * (x2 - x1) / (y2 - y1) + x1;
}

export {
    findXFrom2PointsOnOneLineAndY,
};
