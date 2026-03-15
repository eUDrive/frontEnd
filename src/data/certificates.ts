export type Certificate = {
    id: number;
    title: string;
    duration: string;
    price: number;
    description: string;
    includes: string[];
};

export const certificates: Certificate[] = [
  {
    id: 1,
    title: "Track Start",
    duration: "15-20 минут",
    price: 250,
    description: "Первый выезд на трек для новичков с коротким вводным брифингом.",
    includes: ["Инструктаж", "Шлем", "1 сессия на базовой машине"],
  },
  {
    id: 2,
    title: "Hot Lap Passenger",
    duration: "2-3 круга",
    price: 500,
    description: "Вы пассажиром с инструктором: максимум эмоций без самостоятельного вождения.",
    includes: ["Пилот-инструктор", "Фото на память", "Приоритетный слот"],
  },
  {
    id: 3,
    title: "Race Weekend",
    duration: "до 3 заездов",
    price: 750,
    description: "Подарочный премиум-пакет на трек-день с выбором из доступных авто.",
    includes: ["2 авто на выбор", "Трек-поддержка", "Памятный сертификат"],
  },
];