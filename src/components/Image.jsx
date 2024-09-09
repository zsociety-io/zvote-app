import React from "react";

import Image from "next/image";

function MyImage({ src, alt }) {
    return (
        <Image
            src={src}
            width="0"
            height="0"
            sizes="100vw"
            className="w-auto h-auto"
            alt={alt}
        />
    );
}

export default MyImage;
