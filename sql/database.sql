CREATE SCHEMA kindergarten;
SET search_path TO kindergarten;

CREATE TABLE kindergarten.event_type
(
    id   SERIAL
        CONSTRAINT event_type_pk
            PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE UNIQUE INDEX event_type_name_uindex
    ON kindergarten.event_type (name);

CREATE TABLE kindergarten.event_organizer
(
    id            SERIAL
        CONSTRAINT event_organizer_pk
            PRIMARY KEY,
    name          VARCHAR(20) NOT NULL,
    address       VARCHAR(60) NOT NULL,
    phone_number  VARCHAR(10) NOT NULL,
    site          VARCHAR(20),
    mail          VARCHAR(40) NOT NULL,
    detailed_info TEXT
);

CREATE UNIQUE INDEX event_organizer_mail_uindex
    ON kindergarten.event_organizer (mail);

CREATE UNIQUE INDEX event_organizer_phone_number_uindex
    ON kindergarten.event_organizer (phone_number);

CREATE TABLE kindergarten.event
(
    id                     SERIAL
        CONSTRAINT event_pk
            PRIMARY KEY,
    event_type_id          INT                   NOT NULL
        CONSTRAINT event_event_type_id_fk
            REFERENCES kindergarten.event_type
            ON UPDATE CASCADE ON DELETE CASCADE,
    event_organizer_id     INT                   NOT NULL
        CONSTRAINT event_event_organizer_id_fk
            REFERENCES kindergarten.event_organizer
            ON UPDATE CASCADE ON DELETE CASCADE,
    name                   VARCHAR(40)           NOT NULL,
    date                   DATE                  NOT NULL,
    start_time             TIME                  NOT NULL,
    end_time               INT,
    price                  FLOAT                 NOT NULL,
    min_participants_count INT                   NOT NULL,
    detailed_info          TEXT,
    is_selected            BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE kindergarten."user"
(
    id            SERIAL
        CONSTRAINT user_pk
            PRIMARY KEY,
    name          VARCHAR(40) NOT NULL,
    mail          VARCHAR(40) NOT NULL,
    password_hash CHAR(64)    NOT NULL
);

CREATE UNIQUE INDEX user_mail_uindex
    ON kindergarten."user" (mail);

CREATE TABLE kindergarten.event_organizer_user
(
    event_organizer_id INT NOT NULL
        CONSTRAINT event_organizer_user_event_organizer_id_fk
            REFERENCES kindergarten.event_organizer
            ON UPDATE CASCADE ON DELETE CASCADE,
    user_id            INT NOT NULL
        CONSTRAINT event_organizer_user_user_id_fk
            REFERENCES kindergarten."user"
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT event_organizer_user_pk
        PRIMARY KEY (event_organizer_id, user_id)
);

CREATE TABLE kindergarten.book_status
(
    id          SERIAL
        CONSTRAINT book_status_pk
            PRIMARY KEY,
    status_name VARCHAR(20) NOT NULL
);

CREATE UNIQUE INDEX book_status_status_name_uindex
    ON kindergarten.book_status (status_name);

CREATE TABLE kindergarten.book
(
    event_id       INT NOT NULL
        CONSTRAINT book_event_id_fk
            REFERENCES kindergarten.event
            ON UPDATE CASCADE ON DELETE CASCADE,
    user_id        INT NOT NULL
        CONSTRAINT book_user_id_fk
            REFERENCES kindergarten."user"
            ON UPDATE CASCADE ON DELETE CASCADE,
    book_status_id INT NOT NULL
        CONSTRAINT book_book_status_id_fk
            REFERENCES kindergarten.book_status
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT book_pk
        PRIMARY KEY (event_id, user_id)
);


CREATE TABLE kindergarten.role
(
    id    SERIAL
        CONSTRAINT role_pk
            PRIMARY KEY,
    title VARCHAR(20) NOT NULL
);

CREATE UNIQUE INDEX role_title_uindex
    ON kindergarten.role (title);

CREATE TABLE kindergarten.user_roles
(
    role_id INT NOT NULL
        CONSTRAINT user_roles_role_id_fk
            REFERENCES kindergarten.role
            ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INT NOT NULL
        CONSTRAINT user_roles_user_id_fk
            REFERENCES kindergarten."user"
            ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT user_roles_pk
        PRIMARY KEY (role_id, user_id)
);
