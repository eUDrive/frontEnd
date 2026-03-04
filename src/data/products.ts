export type Car = {
    id: number;
    brand: string;
    model: string;
    year: number;
    horsePower: number;
    category: "GT" | "Touring" | "Sport";
    imageUrl: string;
    pricePerPackage: number;
    description: string;
};

export const cars: Car[] = [
    {
        id: 1,
        brand: "Porsche",
        model: "911 GT3",
        year: 2023,
        horsePower: 502,
        category: "Sport",
        imageUrl: "../../public/images/911gt3.png",
        pricePerPackage: 490,
        description: "Nurburgring Legend",
    },
    {
    id: 2,
    brand: "BMW",
    model: "M4 Competition",
    year: 2022,
    horsePower: 510,
    category: "Sport",
    imageUrl: "../../public/images/m4comp.png",
    pricePerPackage: 450,
    description: "High-performance coupe with aggressive styling and precise handling. Perfect for track days and adrenaline-filled driving experiences."
  },
  {
    id: 3,
    brand: "Porsche",
    model: "911 Carrera",
    year: 2023,
    horsePower: 385,
    category: "GT",
    imageUrl: "../../public/images/911carrera.png",
    pricePerPackage: 600,
    description: "Iconic sports car offering a perfect balance between comfort and performance. Legendary design combined with modern technology."
  },
  {
    id: 4,
    brand: "Audi",
    model: "RS5",
    year: 2021,
    horsePower: 450,
    category: "Touring",
    imageUrl: "../../public/images/rs5.png",
    pricePerPackage: 400,
    description: "Powerful grand tourer with quattro all-wheel drive. Combines everyday usability with impressive acceleration."
  },
  {
    id: 5,
    brand: "Mercedes-Benz",
    model: "AMG GT",
    year: 2022,
    horsePower: 530,
    category: "GT",
    imageUrl: "../../public/images/amggt.png",
    pricePerPackage: 650,
    description: "Luxury grand tourer with a handcrafted AMG engine. Offers refined comfort and explosive performance."
  },
  {
    id: 6,
    brand: "Toyota",
    model: "Supra GR",
    year: 2023,
    horsePower: 340,
    category: "Sport",
    imageUrl: "../../public/images/supra.png",
    pricePerPackage: 350,
    description: "Compact and agile sports car with sharp steering and turbocharged performance. A modern revival of a legendary name."
  }
];