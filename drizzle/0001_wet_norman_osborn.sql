CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`excerpt` varchar(400) NOT NULL DEFAULT '',
	`content` longtext NOT NULL,
	`cover_path` varchar(255),
	`status` varchar(12) NOT NULL DEFAULT 'draft',
	`published_at` timestamp,
	`reading_minutes` int NOT NULL DEFAULT 1,
	`author_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `uploads` (
	`id` varchar(32) NOT NULL,
	`kind` varchar(24) NOT NULL,
	`path` varchar(255) NOT NULL,
	`mime` varchar(60) NOT NULL,
	`size` int NOT NULL,
	`owner_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `uploads_id` PRIMARY KEY(`id`),
	CONSTRAINT `uploads_path_uq` UNIQUE(`path`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(190) NOT NULL,
	`name` varchar(120) NOT NULL,
	`password_hash` varchar(100),
	`role` varchar(12) NOT NULL DEFAULT 'user',
	`company` varchar(160),
	`phone` varchar(32),
	`google_id` varchar(64),
	`email_verified_at` timestamp,
	`token_version` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_uq` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `posts_published_idx` ON `posts` (`status`,`published_at`);--> statement-breakpoint
CREATE INDEX `users_google_idx` ON `users` (`google_id`);