CREATE TABLE `mockups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` varchar(16) NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`title` varchar(120) NOT NULL,
	`device` varchar(8) NOT NULL DEFAULT 'any',
	`kind` varchar(8) NOT NULL,
	`file_id` varchar(32),
	`url` varchar(400),
	`note` text,
	`published_at` datetime,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mockups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`body` varchar(400) NOT NULL DEFAULT '',
	`href` varchar(200) NOT NULL DEFAULT '/proyek',
	`read_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` varchar(16) NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`status` varchar(12) NOT NULL DEFAULT 'draft',
	`items` longtext NOT NULL,
	`discount` int NOT NULL DEFAULT 0,
	`dp_percent` int NOT NULL DEFAULT 50,
	`total` int NOT NULL DEFAULT 0,
	`timeline` varchar(200) NOT NULL DEFAULT '',
	`valid_until` datetime,
	`scope` text,
	`revisions` int NOT NULL DEFAULT 1,
	`domain_hosting` varchar(200) NOT NULL DEFAULT '',
	`terms` text,
	`sent_at` datetime,
	`approved_at` datetime,
	`created_by` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `mockups_project_idx` ON `mockups` (`project_id`,`version`);--> statement-breakpoint
CREATE INDEX `notifications_user_idx` ON `notifications` (`user_id`,`read_at`);--> statement-breakpoint
CREATE INDEX `quotes_project_idx` ON `quotes` (`project_id`,`version`);