export type ProductImage = {
    id: number;
    url: string;
    productId: number;
};

export type DescriptionAdvanced = {
    id: number;
    h: number;
    w: number;
    l: number;
};

export type ProductDescription = {
    id: number;
    description: string;
    descriptionAdvanced?: DescriptionAdvanced;
};

export type ProductCategory = "GT" | "Touring" | "Sport";
export type ProductStatus = "Active" | "Inactive" | "Discontinued";

export type Car = {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: ProductCategory;
    images: ProductImage[];
    description?: ProductDescription;
    status: ProductStatus;
};

export const cars: Car[] = [
    {
        id: 1,
        name: "Porsche 911 GT3",
        price: 490,
        stock: 5,
        category: "Sport",
        images: [
            { id: 1, url: "/images/911gt3.png", productId: 1 },
            { id: 2, url: "/images/911gt3.png", productId: 1 },
            { id: 3, url: "/images/911gt3.png", productId: 1 }
        ],
        description: {
            id: 1,
            description: "Nurburgring Legend - Experience the raw performance of one of the most iconic sports cars. The 911 GT3 is engineered for ultimate track performance with precision handling and explosive acceleration.",
            descriptionAdvanced: { id: 1, h: 502, w: 1450, l: 35 }
        },
        status: "Active"
    },
    {
        id: 2,
        name: "BMW M4 Competition",
        price: 450,
        stock: 3,
        category: "Sport",
        images: [
            { id: 4, url: "/images/m4comp.png", productId: 2 },
            { id: 5, url: "/images/m4comp.png", productId: 2 },
            { id: 6, url: "/images/m4comp.png", productId: 2 }
        ],
        description: {
            id: 2,
            description: "High-performance coupe with aggressive styling and precise handling. Perfect for track days and adrenaline-filled driving experiences. Features BMW's legendary engineering and cutting-edge technology.",
            descriptionAdvanced: { id: 2, h: 510, w: 1535, l: 36 }
        },
        status: "Active"
    },
    {
        id: 3,
        name: "Porsche 911 Carrera",
        price: 600,
        stock: 4,
        category: "GT",
        images: [
            { id: 7, url: "/images/911carrera.png", productId: 3 },
            { id: 8, url: "/images/911carrera.png", productId: 3 },
            { id: 9, url: "/images/911carrera.png", productId: 3 }
        ],
        description: {
            id: 3,
            description: "Iconic sports car offering a perfect balance between comfort and performance. Legendary design combined with modern technology. Ideal for both spirited driving and long journeys.",
            descriptionAdvanced: { id: 3, h: 385, w: 1420, l: 43 }
        },
        status: "Active"
    },
    {
        id: 4,
        name: "Audi RS5",
        price: 400,
        stock: 6,
        category: "Touring",
        images: [
            { id: 10, url: "/images/rs5.png", productId: 4 },
            { id: 11, url: "/images/rs5.png", productId: 4 },
            { id: 12, url: "/images/rs5.png", productId: 4 }
        ],
        description: {
            id: 4,
            description: "Powerful grand tourer with quattro all-wheel drive. Combines everyday usability with impressive acceleration. Premium interior and advanced technology make this the perfect luxury performance car.",
            descriptionAdvanced: { id: 4, h: 450, w: 1590, l: 38 }
        },
        status: "Active"
    },
    {
        id: 5,
        name: "Mercedes-Benz AMG GT",
        price: 650,
        stock: 2,
        category: "GT",
        images: [
            { id: 13, url: "/images/amggt.png", productId: 5 },
            { id: 14, url: "/images/amggt.png", productId: 5 },
            { id: 15, url: "/images/amggt.png", productId: 5 }
        ],
        description: {
            id: 5,
            description: "Luxury grand tourer with a handcrafted AMG engine. Offers refined comfort and explosive performance. Stunning design paired with cutting-edge performance technology.",
            descriptionAdvanced: { id: 5, h: 530, w: 1540, l: 34 }
        },
        status: "Active"
    },
    {
        id: 6,
        name: "Toyota Supra GR",
        price: 350,
        stock: 8,
        category: "Sport",
        images: [
            { id: 16, url: "/images/supra.png", productId: 6 },
            { id: 17, url: "/images/supra.png", productId: 6 },
            { id: 18, url: "/images/supra.png", productId: 6 }
        ],
        description: {
            id: 6,
            description: "Compact and agile sports car with sharp steering and turbocharged performance. A modern revival of a legendary name. Perfect for drivers who value precision and responsiveness.",
            descriptionAdvanced: { id: 6, h: 340, w: 1290, l: 40 }
        },
        status: "Active"
    }
];
