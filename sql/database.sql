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
    end_time               TIME,
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
    email         VARCHAR(40) NOT NULL,
    password_hash CHAR(64)    NOT NULL
);

CREATE UNIQUE INDEX user_mail_uindex
    ON kindergarten."user" (email);

CREATE TABLE kindergarten.event_organizer_user
(
    event_organizer_id INT NOT NULL
        CONSTRAINT event_organizer_user_event_organizer_id_fk
            REFERENCES kindergarten.event_organizer
            ON UPDATE CASCADE ON DELETE CASCADE,
    user_id            INT NOT NULL
        CONSTRAINT event_organizer_user_user_id_fken
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

INSERT INTO kindergarten.role (title)
VALUES ('manager');
-- PASS is 12345
INSERT INTO kindergarten."user" (name, email, password_hash)
VALUES ('Natasha', 'natasha@gmail.com', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5');
INSERT INTO kindergarten.user_roles (role_id, user_id)
VALUES (1, 1);

-- add event organizer
INSERT INTO kindergarten.event_organizer (name, address, phone_number, site, mail, detailed_info)
VALUES ('Child Fun', 'USA, New York, central street', '0234321343', 'child-fun.com', 'child.fun@gmail.com',
        'Company about children love'),
       ('Three bear', 'USA, New York, washington street', '023434323', NULL, 'three.bear@yahoo.com',
        'Clowns, fest and much more');

INSERT INTO kindergarten.event_type (name)
VALUES ('theatre'),
       ('excursions'),
       ('trips to the circus');
-- Pass is thomas
INSERT INTO kindergarten."user" (name, email, password_hash)
VALUES ('Thomas', 'thomas@bing.com', 'd38681074467c0bc147b17a9a12b9efa8cc10bcf545f5b0bccccf5a93c4a2b79');

INSERT INTO kindergarten.event_organizer_user (event_organizer_id, user_id)
VALUES (1, 2);

INSERT INTO kindergarten.book_status (status_name)
VALUES ('booked'),
       ('preordered');

-- Pass is cage
INSERT INTO kindergarten."user" (name, email, password_hash)
VALUES ('Nicolas', 'nicolas@bing.com', '5943be120e49e99345f31b6b98708dfac9276978d29603c0398222670ecfdf8f');
