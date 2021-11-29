import { Pool } from 'pg';

const connectionString =
  'postgresql://postgres:mysecretpassword@localhost:5432/postgres';

const pool = new Pool({ connectionString });

function random(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from)) + from;
}

(() => {
  for (let index = 0; index < 100_000; index++) {
    (async () => {
      const eventTypeID = random(1, 4);
      const eventOrganizerID = random(1, 3);
      const name = `Name: ${Math.random()}`;
      const date = new Date('2021-12-30');
      const time = '12:45';
      const price = random(0, 1000);
      const minParticipantsCount = random(1, 100);

      try {
        await pool.query(
          `INSERT INTO kindergarten.event (event_type_id, event_organizer_id, name, date, start_time, price,
                                min_participants_count)
                                VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [
            eventTypeID,
            eventOrganizerID,
            name,
            date,
            time,
            price,
            minParticipantsCount,
          ],
        );
        console.log('Inserted successfully');
      } catch (error) {
        console.log(error);
        console.log('Something gone wrong', error);
      }
    })();
  }
})();
