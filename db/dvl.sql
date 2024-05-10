CREATE TABLE `users` (
  `user_id` integer PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` longtext,
  `created_at` timestamp DEFAULT now()
);

CREATE TABLE `contact` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp DEFAULT now()
);


CREATE TABLE `numbers_us` (
  `number` integer NOT NULL,
  `type` ENUM ('gruas', 'denuncias', 'emergencias'),
  `updated_by` integer
);

ALTER TABLE `numbers_us` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`user_id`);

-- insert into users (user_id, username, email, password, role_id, avatar, created_at) values (1, 'admin', 'admin@admin.com', 'admin', 1, '', '');

insert into numbers_us (number, type, updated_by) values (2500, 'gruas', 1);
insert into numbers_us (number, type, updated_by) values (550, 'denuncias', 1);
insert into numbers_us (number, type, updated_by) values (600, 'emergencias', 1);
