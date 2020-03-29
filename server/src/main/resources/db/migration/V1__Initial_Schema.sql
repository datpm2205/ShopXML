set time zone +7;

create extension if not exists "uuid-ossp";

create table if not exists app_user
(
    id        serial       not null primary key,
    user_name varchar(36)  not null unique,
    password  varchar(128) not null,
    full_name varchar(250) not null,
    email     varchar(250) not null,
    phone     varchar(250) not null
);

create table if not exists product
(
    id               serial       not null primary key,
    name             varchar(250) not null,
    image            varchar(250) not null,
    price            int          not null,
    description      varchar(250) not null,
    full_description text         not null,
    last_update      date         not null,
    status           int          not null
);

create table if not exists bill
(
    id               serial       not null primary key,
    user_id          int          not null,
    date_create      date         not null,
    recipient_name    varchar(250) not null,
    recipient_phone   varchar(250) not null,
    recipient_address varchar(250) not null,
    status           int          not null,
    constraint bill_fk1 foreign key (user_id) references app_user (id)
);

create table if not exists bill_detail
(
    id            serial       not null primary key,
    bill_id       int          not null,
    product_name  varchar(250) not null,
    product_image varchar(250) not null,
    product_price int          not null,
    amount        int          not null,
    constraint bill_detail_fk1 foreign key (bill_id) references bill (id)
);

insert into app_user (user_name, password, full_name, email, phone)
values ('duc010298', 'duc1020102', 'Đỗ Trung Đức', 'duc010298@gmail.com', '0962481497');