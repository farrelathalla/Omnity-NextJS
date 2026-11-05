ALTER TABLE `email_tokens` MODIFY COLUMN `expires_at` datetime NOT NULL;--> statement-breakpoint
ALTER TABLE `email_tokens` MODIFY COLUMN `used_at` datetime;--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `published_at` datetime;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email_verified_at` datetime;