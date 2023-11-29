CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`avatar_url` text
);
--> statement-breakpoint
DROP TABLE `cities`;--> statement-breakpoint
DROP TABLE `countries`;--> statement-breakpoint
CREATE UNIQUE INDEX `nameIdx` ON `users` (`email`);