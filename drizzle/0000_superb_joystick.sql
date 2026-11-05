CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(190) NOT NULL,
	`company` varchar(160),
	`phone` varchar(32),
	`topic` varchar(80) NOT NULL DEFAULT 'umum',
	`message` text NOT NULL,
	`source` varchar(160),
	`ip` varchar(64),
	`status` varchar(20) NOT NULL DEFAULT 'new',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` varchar(190) NOT NULL,
	`count` int NOT NULL DEFAULT 0,
	`window_start` bigint NOT NULL,
	CONSTRAINT `rate_limits_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE INDEX `inquiries_created_idx` ON `inquiries` (`created_at`);