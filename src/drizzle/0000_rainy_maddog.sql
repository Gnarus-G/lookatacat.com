-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `Account` (
	`id` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`providerAccountId` varchar(191) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(191),
	`scope` varchar(191),
	`id_token` text,
	`session_state` varchar(191),
	CONSTRAINT `Account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Cat` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`ownerId` varchar(191) NOT NULL,
	`favoritePicUrl` varchar(191),
	CONSTRAINT `Cat_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `CatPic` (
	`url` varchar(191) NOT NULL,
	`catId` varchar(191) NOT NULL,
	CONSTRAINT `CatPic_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `CatVideo` (
	`url` varchar(191) NOT NULL,
	`catId` varchar(191) NOT NULL,
	CONSTRAINT `CatVideo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Invitee` (
	`email` varchar(191) NOT NULL,
	CONSTRAINT `Invitee_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Session` (
	`id` varchar(191) NOT NULL,
	`sessionToken` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL,
	CONSTRAINT `Session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`emailVerified` datetime(3),
	`image` varchar(191),
	CONSTRAINT `User_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `VerificationToken` (
	`identifier` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `Account_provider_providerAccountId_key` ON `Account` (`provider`,`providerAccountId`);--> statement-breakpoint
CREATE INDEX `Cat_name_key` ON `Cat` (`name`);--> statement-breakpoint
CREATE INDEX `Cat_favoritePicUrl_key` ON `Cat` (`favoritePicUrl`);--> statement-breakpoint
CREATE INDEX `Session_sessionToken_key` ON `Session` (`sessionToken`);--> statement-breakpoint
CREATE INDEX `User_email_key` ON `User` (`email`);--> statement-breakpoint
CREATE INDEX `VerificationToken_token_key` ON `VerificationToken` (`token`);--> statement-breakpoint
CREATE INDEX `VerificationToken_identifier_token_key` ON `VerificationToken` (`identifier`,`token`);
*/