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

    // Запрос для получения почтового индекса по адресу
    const addressQuery = `SELECT "Address", "Postal_Code" FROM public."Address_PostalCode" WHERE "Address" = 'Москва, Ул. Примерная 42'`;
    const addressResult = await client.query(addressQuery);
    if (addressResult.rows.length > 0) {
      console.log(`Почтовый индекс: ${addressResult.rows[0].Postal_Code}, Принадлежит данному адресу: ${addressResult.rows[0].Address}`);
    } else if (addressResult.rows[0].Address === Null) {
      console.log('Тут будет код обращающийся к внешнему запросу!');
    }
      else
      {
        console.log('Данного почтового индекса нету и в нашей БД и в внешнем запросе!')
      }

    // Запрос для получения почтового индекса по координатам
    const coordinateQuery = `SELECT "Latitude", "Longitude", "Postal_Code" FROM public."Coordinate_PostalCode" WHERE "Latitude" = 43.1241 AND "Longitude" = 40.1243`;
    const coordinateResult = await client.query(coordinateQuery);
    if (coordinateResult.rows.length > 0) {
      console.log(`Почтовый индекс: ${coordinateResult.rows[0].Postal_Code}, Принадлежит долготе: ${coordinateResult.rows[0].Latitude}, широте: ${coordinateResult.rows[0].Longitude}.`);
    } else if (coordinateResult.rows[0].Latitude === Null || coordinateResult.rows[0].Latitude === Null) {
      console.log('Тут будет код обращающийся к внешнему запросу!');
    }
      else
      {
        console.log('Данного почтового индекса нету и в нашей БД и в внешнем запросе!')
      }
  } catch (error) {
    console.error('Ошибка при выполнении запросов:', error);
  } finally {
    await client.end();
  }
}

bootstrap();
