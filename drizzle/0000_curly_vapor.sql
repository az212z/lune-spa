CREATE TABLE `bookings` (
	`tenant` text NOT NULL,
	`id` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`staff` text NOT NULL,
	`services` text NOT NULL,
	`total` integer NOT NULL,
	`duration` integer NOT NULL,
	`status` text NOT NULL,
	`preferences` text NOT NULL,
	`paid` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL,
	PRIMARY KEY(`tenant`, `id`)
);
--> statement-breakpoint
CREATE INDEX `idx_bookings_date` ON `bookings` (`tenant`,`date`);--> statement-breakpoint
CREATE TABLE `records` (
	`tenant` text NOT NULL,
	`id` text NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`tenant`, `id`)
);
--> statement-breakpoint
CREATE INDEX `idx_records_kind` ON `records` (`tenant`,`kind`);--> statement-breakpoint
CREATE TABLE `slots` (
	`tenant` text NOT NULL,
	`resource` text NOT NULL,
	`date` text NOT NULL,
	`minute` integer NOT NULL,
	`booking` text NOT NULL,
	PRIMARY KEY(`tenant`, `resource`, `date`, `minute`)
);
--> statement-breakpoint
CREATE INDEX `idx_slots_booking` ON `slots` (`tenant`,`booking`);