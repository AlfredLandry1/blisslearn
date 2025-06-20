-- CreateTable
CREATE TABLE `course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `platform` VARCHAR(191) NULL,
    `provider` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `skills` TEXT NULL,
    `level` VARCHAR(191) NULL,
    `duration` VARCHAR(191) NULL,
    `rating` DOUBLE NULL,
    `price` VARCHAR(191) NULL,
    `language` VARCHAR(191) NULL,
    `format` VARCHAR(191) NULL,
    `start_date` DATETIME(3) NULL,
    `url` VARCHAR(191) NULL,
    `certificate_type` VARCHAR(191) NULL,
    `extra` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `course_platform_provider_idx`(`platform`, `provider`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
