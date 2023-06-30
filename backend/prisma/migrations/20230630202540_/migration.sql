-- DropForeignKey
ALTER TABLE `chessgame` DROP FOREIGN KEY `ChessGame_playerBlackId_fkey`;

-- DropForeignKey
ALTER TABLE `chessgame` DROP FOREIGN KEY `ChessGame_playerWhiteId_fkey`;

-- AlterTable
ALTER TABLE `chessgame` MODIFY `playerWhiteId` VARCHAR(191) NULL,
    MODIFY `playerBlackId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));

-- AddForeignKey
ALTER TABLE `ChessGame` ADD CONSTRAINT `ChessGame_playerWhiteId_fkey` FOREIGN KEY (`playerWhiteId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChessGame` ADD CONSTRAINT `ChessGame_playerBlackId_fkey` FOREIGN KEY (`playerBlackId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
