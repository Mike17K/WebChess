-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));

-- CreateTable
CREATE TABLE `ChessGame` (
    `id` VARCHAR(191) NOT NULL,
    `playerWhiteId` VARCHAR(191) NOT NULL,
    `playerBlackId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `result` VARCHAR(191) NULL,
    `pgn` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChessGame` ADD CONSTRAINT `ChessGame_playerWhiteId_fkey` FOREIGN KEY (`playerWhiteId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChessGame` ADD CONSTRAINT `ChessGame_playerBlackId_fkey` FOREIGN KEY (`playerBlackId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
