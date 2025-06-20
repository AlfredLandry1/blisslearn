-- CreateTable
CREATE TABLE `onboarding_responses` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `learningObjectives` TEXT NOT NULL,
    `domainsOfInterest` TEXT NOT NULL,
    `skillLevel` VARCHAR(191) NOT NULL,
    `weeklyHours` INTEGER NOT NULL,
    `preferredPlatforms` TEXT NOT NULL,
    `courseFormat` TEXT NOT NULL,
    `courseDuration` VARCHAR(191) NOT NULL,
    `courseLanguage` VARCHAR(191) NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `onboarding_responses_userId_key`(`userId`),
    INDEX `onboarding_responses_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `onboarding_responses` ADD CONSTRAINT `onboarding_responses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
