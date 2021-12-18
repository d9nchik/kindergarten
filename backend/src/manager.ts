import db from './db';
import { getEventByID } from './user';

export const getAllOrganizers = async (): Promise<
  { id: number; companyName: string }[]
> => {
  try {
    const response = await db.query(
      'SELECT id, name FROM kindergarten.event_organizer',
    );
    return response.rows.map((e) => ({
      id: Number(e.id),
      companyName: String(e.name),
    }));
  } catch (error) {
    return [];
  }
};

interface OrganizerInformation {
  organizerID: number;
  name: string;
  address: string;
  phone_number: string;
  site: string | null;
  mail: string;
  detailed_info: string | null;
}

export const getOrganizer = async (
  organizerID: number,
): Promise<OrganizerInformation | null> => {
  try {
    const response = await db.query(
      `SELECT name, address, phone_number, site, mail, detailed_info
         FROM kindergarten.event_organizer WHERE id=$1;`,
      [organizerID],
    );

    if (response.rows.length === 0) {
      return null;
    }
    const currentRow = response.rows[0];
    return {
      organizerID: organizerID,
      name: currentRow.name,
      address: currentRow.address,
      phone_number: currentRow.phone_number,
      site: currentRow.site,
      mail: currentRow.mail,
      detailed_info: currentRow.detailed_info,
    };
  } catch (error) {
    return null;
  }
};

export const updateOrganizer = async ({
  name,
  address,
  phone_number,
  site,
  mail,
  detailed_info,
  organizerID,
}: OrganizerInformation) => {
  try {
    await db.query(
      `UPDATE kindergarten.event_organizer
        SET name=$1,
            address=$2,
            phone_number=$3,
            site=$4,
            mail=$5,
            detailed_info=$6
        WHERE id = $7;`,
      [name, address, phone_number, site, mail, detailed_info, organizerID],
    );
  } catch (error) {
    console.error(error);
  }
};

export const getNotSelectedEvents = async () => {
  try {
    const result = await db.query(`SELECT id,
                                        name,
                                        price,
                                        date,
                                        start_time,
                                        end_time,
                                        min_participants_count,
                                        detailed_info
                                  FROM kindergarten.event
                                  WHERE is_selected = FALSE
                                    AND (date + start_time) > NOW() + '3d';`);
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      date: row.date,
      start_time: row.start_time,
      end_time: row.end_time,
      min_participants_count: row.min_participants_count,
      detailed_info: row.detailed_info,
    }));
  } catch (err) {
    return [];
  }
};

export const selectEvent = async (eventID: number) => {
  try {
    await db.query(
      `UPDATE kindergarten.event
        SET is_selected= TRUE
        WHERE id = $1;`,
      [eventID],
    );
    return getEventByID(String(eventID));
  } catch (err) {
    return null;
  }
};

export const futureEvents = async () => {
  try {
    const result = await db.query(`SELECT name,
                                          e.id AS id,
                                          price,
                                          date,
                                          start_time,
                                          end_time,
                                          min_participants_count,
                                          detailed_info,
                                          user_joined
                                    FROM (
                                            SELECT id, COUNT(user_id) AS user_joined
                                            FROM kindergarten.event
                                                      LEFT JOIN kindergarten.book b on event.id = b.event_id
                                            WHERE is_selected = TRUE
                                              AND (date + start_time) > NOW()
                                            GROUP BY id) T
                                            JOIN kindergarten.event e ON T.id = e.id;`);
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      date: row.date,
      start_time: row.start_time,
      end_time: row.end_time,
      min_participants_count: row.min_participants_count,
      detailed_info: row.detailed_info,
      user_joined: Number(row.user_joined),
    }));
  } catch (err) {
    return [];
  }
};
