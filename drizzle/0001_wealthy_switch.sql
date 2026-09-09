CREATE TABLE `guest_receipts` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`tenant` text NOT NULL,
	`booking` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `request_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`window` integer NOT NULL,
	`hits` integer NOT NULL
);
