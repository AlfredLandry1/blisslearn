-- DropIndex
DROP INDEX `notification_read_idx` ON `notification`;

-- DropIndex
DROP INDEX `notification_type_idx` ON `notification`;

-- CreateIndex
CREATE INDEX `notification_userId_createdAt_idx` ON `notification`(`userId`, `createdAt`);
