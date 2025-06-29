-- CreateTable
CREATE TABLE `account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_fkey`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `provider` VARCHAR(191) NULL DEFAULT 'credentials',
    `onboardingCompleted` BOOLEAN NOT NULL DEFAULT false,
    `onboardingStep` INTEGER NOT NULL DEFAULT 1,
    `bio` TEXT NULL,
    `location` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `jobTitle` VARCHAR(191) NULL,
    `skills` TEXT NULL,
    `interests` TEXT NULL,
    `learningGoals` TEXT NULL,
    `timezone` VARCHAR(191) NULL DEFAULT 'Europe/Paris',
    `language` VARCHAR(191) NULL DEFAULT 'fr',
    `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    `pushNotifications` BOOLEAN NOT NULL DEFAULT true,
    `totalCoursesStarted` INTEGER NOT NULL DEFAULT 0,
    `totalCoursesCompleted` INTEGER NOT NULL DEFAULT 0,
    `totalTimeSpent` INTEGER NOT NULL DEFAULT 0,
    `totalCertifications` INTEGER NOT NULL DEFAULT 0,
    `streakDays` INTEGER NOT NULL DEFAULT 0,
    `lastActivityAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    INDEX `user_onboardingCompleted_idx`(`onboardingCompleted`),
    INDEX `user_lastActivityAt_idx`(`lastActivityAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `verificationtoken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passwordResetToken` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `passwordResetToken_token_key`(`token`),
    INDEX `passwordResetToken_userId_idx`(`userId`),
    INDEX `passwordResetToken_token_idx`(`token`),
    INDEX `passwordResetToken_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_message` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `link` TEXT NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `institution` VARCHAR(191) NULL,
    `instructor` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `skills` TEXT NULL,
    `category` VARCHAR(191) NULL,
    `level_normalized` VARCHAR(191) NULL,
    `duration_hours` DOUBLE NULL,
    `price_numeric` DOUBLE NULL,
    `rating_numeric` DOUBLE NULL,
    `reviews_count_numeric` INTEGER NULL,
    `enrolled_students` VARCHAR(191) NULL,
    `course_type` VARCHAR(191) NULL,
    `mode` VARCHAR(191) NULL,
    `availability` VARCHAR(191) NULL,
    `source_file` VARCHAR(191) NULL,
    `provider` VARCHAR(191) NULL,
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

    UNIQUE INDEX `course_course_id_key`(`course_id`),
    INDEX `course_platform_idx`(`platform`),
    INDEX `course_category_idx`(`category`),
    INDEX `course_level_normalized_idx`(`level_normalized`),
    INDEX `course_course_type_idx`(`course_type`),
    INDEX `course_institution_idx`(`institution`),
    INDEX `course_rating_numeric_idx`(`rating_numeric`),
    INDEX `course_price_numeric_idx`(`price_numeric`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_course_progress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `favorite` BOOLEAN NOT NULL DEFAULT false,
    `notes` TEXT NULL,
    `progressPercentage` DECIMAL(5, 2) NULL,
    `timeSpent` INTEGER NULL,
    `lastActivityAt` DATETIME(3) NULL,
    `currentPosition` VARCHAR(191) NULL,
    `bookmarks` TEXT NULL,
    `rating` INTEGER NULL,
    `review` TEXT NULL,
    `difficulty` VARCHAR(191) NULL,
    `completionDate` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `user_course_progress_userId_idx`(`userId`),
    INDEX `user_course_progress_courseId_idx`(`courseId`),
    INDEX `user_course_progress_status_idx`(`status`),
    INDEX `user_course_progress_lastActivityAt_idx`(`lastActivityAt`),
    UNIQUE INDEX `user_course_progress_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `lastUpdatedAt` DATETIME(3) NULL,
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

-- CreateTable
CREATE TABLE `learning_path` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `learning_path_course` (
    `id` VARCHAR(191) NOT NULL,
    `learningPathId` VARCHAR(191) NOT NULL,
    `courseId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` INTEGER NOT NULL,
    `progressId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `certificateNumber` VARCHAR(191) NOT NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,
    `courseTitle` VARCHAR(191) NOT NULL,
    `institution` VARCHAR(191) NULL,
    `level` VARCHAR(191) NULL,
    `duration` VARCHAR(191) NULL,
    `timeSpent` INTEGER NULL,
    `completionDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `isVerified` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `certification_certificateNumber_key`(`certificateNumber`),
    INDEX `certification_userId_idx`(`userId`),
    INDEX `certification_courseId_idx`(`courseId`),
    INDEX `certification_progressId_idx`(`progressId`),
    INDEX `certification_certificateNumber_idx`(`certificateNumber`),
    INDEX `certification_issuedAt_idx`(`issuedAt`),
    INDEX `certification_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `readAt` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `actionUrl` VARCHAR(191) NULL,
    `actionText` VARCHAR(191) NULL,
    `metadata` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `notification_userId_idx`(`userId`),
    INDEX `notification_read_idx`(`read`),
    INDEX `notification_createdAt_idx`(`createdAt`),
    INDEX `notification_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `onboarding_responses` ADD CONSTRAINT `onboarding_responses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `passwordResetToken` ADD CONSTRAINT `passwordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_message` ADD CONSTRAINT `chat_message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_course_progress` ADD CONSTRAINT `user_course_progress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_course_progress` ADD CONSTRAINT `user_course_progress_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `milestone` ADD CONSTRAINT `milestone_progressId_fkey` FOREIGN KEY (`progressId`) REFERENCES `user_course_progress`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_report` ADD CONSTRAINT `course_report_progressId_fkey` FOREIGN KEY (`progressId`) REFERENCES `user_course_progress`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_path_course` ADD CONSTRAINT `learning_path_course_learningPathId_fkey` FOREIGN KEY (`learningPathId`) REFERENCES `learning_path`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `learning_path_course` ADD CONSTRAINT `learning_path_course_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certification` ADD CONSTRAINT `certification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certification` ADD CONSTRAINT `certification_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certification` ADD CONSTRAINT `certification_progressId_fkey` FOREIGN KEY (`progressId`) REFERENCES `user_course_progress`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
