-- CreateTable
CREATE TABLE `milestone` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` INTEGER NOT NULL,
    `progressId` VARCHAR(191) NOT NULL,
    `percentage` INTEGER NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `timeSpentAtMilestone` INTEGER NULL,
    `positionAtMilestone` VARCHAR(191) NULL,
    `notesAtMilestone` TEXT NULL,
    `learningSummary` TEXT NULL,
    `keyConcepts` TEXT NULL,
    `challenges` TEXT NULL,
    `nextSteps` TEXT NULL,
    `validatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `milestone_userId_courseId_idx`(`userId`, `courseId`),
    INDEX `milestone_progressId_idx`(`progressId`),
    UNIQUE INDEX `milestone_userId_courseId_percentage_key`(`userId`, `courseId`, `percentage`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_report` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` INTEGER NOT NULL,
    `progressId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `milestonePercentage` INTEGER NULL,
    `summary` TEXT NOT NULL,
    `keyPoints` TEXT NOT NULL,
    `recommendations` TEXT NULL,
    `insights` TEXT NULL,
    `generatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `course_report_userId_courseId_idx`(`userId`, `courseId`),
    INDEX `course_report_progressId_idx`(`progressId`),
    INDEX `course_report_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `milestone` ADD CONSTRAINT `milestone_progressId_fkey` FOREIGN KEY (`progressId`) REFERENCES `user_course_progress`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_report` ADD CONSTRAINT `course_report_progressId_fkey` FOREIGN KEY (`progressId`) REFERENCES `user_course_progress`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
