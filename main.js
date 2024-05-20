const { Client } = require('pg');

async function bootstrap() {
  const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    database: 'Zadanie1',
    password: '13579',
  });

  try {
    await client.connect();

    async function Address(data) {
      try {
        const query = `INSERT INTO public."Address_PostalCode" ("Address", "Postal_Code") VALUES ($1, $2)`;
        const values = [data[0].address.road, data[0].address.postcode];
        await client.query(query, values);
        console.log('Данные успешно занесены в таблицу.');
      } catch (error) {
        console.error('Ошибка при занесении данных в таблицу:', error);
      }
    }

    async function Coordinate(data) {
      try {
        const query = `INSERT INTO public."Coordinate_PostalCode" ("Latitude", "Longitude", "Postal_Code") VALUES ($1, $2, $3)`;
        const values = [data.lat, data.lon, data.address.postcode];
        await client.query(query, values);
        console.log('Данные успешно занесены в таблицу.');
      } catch (error) {
        console.error('Ошибка при занесении данных в таблицу:', error);
      }
    }

    const address = 'Москва, Басманный пер. 1';
    const lat = 55.770259;
    const lon = 37.657305;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;
    const url2 = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

    const [addressData, coordinateData] = await Promise.all([
      fetch(url).then(response => response.json()),
      fetch(url2).then(response => response.json())
    ]);

    if (addressData.length > 0) {
      console.log(`Почтовый индекс: ${addressData[0].address.postcode}, Адрес: ${address}`);
      await Address(addressData);
    } else {
      console.log('Адрес не найден');
    }

    if (coordinateData.address) {
      console.log(`Почтовый индекс: ${coordinateData.address.postcode}, Широта: 55.770259, Долгота: 37.657305`);
      await Coordinate(coordinateData);
    } else {
      console.log('Координаты не соответствуют известному адресу');
    }
  } catch (error) {
    console.error('Ошибка при выполнении запросов:', error);
  } finally {
    await client.end();
  }
}

bootstrap();
