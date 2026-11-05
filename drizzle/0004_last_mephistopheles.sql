CREATE TABLE `project_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` varchar(16) NOT NULL,
	`from_status` varchar(24),
	`to_status` varchar(24) NOT NULL,
	`note` text,
	`by_user_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(16) NOT NULL,
	`user_id` int NOT NULL,
	`type` varchar(16) NOT NULL DEFAULT 'website',
	`status` varchar(24) NOT NULL DEFAULT 'draft',
	`title` varchar(160) NOT NULL DEFAULT '',
	`prompt` text,
	`template_id` varchar(40),
	`survey` longtext NOT NULL,
	`survey_step` int NOT NULL DEFAULT 1,
	`admin_note` text,
	`submitted_at` datetime,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `uploads` ADD `visibility` varchar(8) DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE `uploads` ADD `project_id` varchar(16);--> statement-breakpoint
ALTER TABLE `uploads` ADD `original_name` varchar(160);--> statement-breakpoint
CREATE INDEX `project_events_project_idx` ON `project_events` (`project_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `projects_user_idx` ON `projects` (`user_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `projects_status_idx` ON `projects` (`status`);--> statement-breakpoint
CREATE INDEX `uploads_project_idx` ON `uploads` (`project_id`);