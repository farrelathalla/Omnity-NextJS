CREATE TABLE `email_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` varchar(12) NOT NULL,
	`token_hash` varchar(64) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`used_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_tokens_hash_uq` UNIQUE(`token_hash`)
);
--> statement-breakpoint
CREATE INDEX `email_tokens_user_idx` ON `email_tokens` (`user_id`,`type`);