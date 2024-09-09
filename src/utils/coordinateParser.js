function parseDMS(dmsString) {
    const dmsRegex = /(\d+)[°](\d+)'(\d+\.?\d*)["]([NSEW])/g;
    let match;
    const coordinates = {};

    while ((match = dmsRegex.exec(dmsString)) !== null) {
        const degrees = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseFloat(match[3]);
        const direction = match[4];

        let decimal = degrees + minutes / 60 + seconds / 3600;
        if (direction === "S" || direction === "W") {
            decimal *= -1;
        }

        if (direction === "N" || direction === "S") {
            coordinates.latitude = decimal;
        } else {
            coordinates.longitude = decimal;
        }
    }

    return coordinates;
}

export default function generateGoogleMapsEmbedURL(dmsString) {
    const { latitude, longitude } = parseDMS(dmsString);

    if (latitude === undefined || longitude === undefined) {
        throw new Error("Invalid DMS format");
    }

    return `https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2953.201139576402!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDLCsDE1JzEwLjQiTiA0MsKwNDAnNDkuOCJF!5e0!3m2!1sen!2sge!4v1721118567749!5m2!1sen!2sge`;
}


