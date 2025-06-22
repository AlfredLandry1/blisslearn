-- AlterTable
ALTER TABLE `user_course_progress` ADD COLUMN `bookmarks` TEXT NULL,
    ADD COLUMN `completionDate` DATETIME(3) NULL,
    ADD COLUMN `currentPosition` VARCHAR(191) NULL,
    ADD COLUMN `difficulty` VARCHAR(191) NULL,
    ADD COLUMN `lastActivityAt` DATETIME(3) NULL,
    ADD COLUMN `progressPercentage` DECIMAL(5, 2) NULL,
    ADD COLUMN `rating` INTEGER NULL,
    ADD COLUMN `review` TEXT NULL,
    ADD COLUMN `timeSpent` INTEGER NULL;

-- CreateIndex
CREATE INDEX `user_course_progress_status_idx` ON `user_course_progress`(`status`);

-- CreateIndex
CREATE INDEX `user_course_progress_lastActivityAt_idx` ON `user_course_progress`(`lastActivityAt`);
