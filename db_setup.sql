create database if not exists WebChessDb;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `salt` VARCHAR(191) NULL,
    `aud` VARCHAR(191) NULL,
    `authProvider` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` VARCHAR(191) NOT NULL,
    `profilename` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `picture` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `rating` INTEGER NOT NULL DEFAULT 0,
    `userid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Profile_profilename_key`(`profilename`),
    UNIQUE INDEX `Profile_email_key`(`email`),
    UNIQUE INDEX `Profile_userid_key`(`userid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expired` DATETIME(3) NOT NULL,
    `userid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tactic` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `titleCategory` VARCHAR(191) NOT NULL,
    `fen` VARCHAR(191) NOT NULL,
    `hints` VARCHAR(191) NOT NULL,
    `tacticInfo` VARCHAR(191) NOT NULL,
    `solution` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(191) NOT NULL,
    `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id)),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChessGame` (
    `id` VARCHAR(191) NOT NULL,
    `playerWhiteId` VARCHAR(191) NULL,
    `playerBlackId` VARCHAR(191) NULL,
    `whitePlayerTime` INTEGER NOT NULL,
    `blackPlayerTime` INTEGER NOT NULL,
    `visibility` ENUM('public', 'private') NOT NULL DEFAULT 'public',
    `status` VARCHAR(191) NOT NULL,
    `result` VARCHAR(191) NULL,
    `pgn` VARCHAR(191) NULL,
    `fen` VARCHAR(191) NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    `metadata` JSON NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NULL,
    `accessKey` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Friends` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Friends_AB_unique`(`A`, `B`),
    INDEX `_Friends_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TacticToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_TacticToUser_AB_unique`(`A`, `B`),
    INDEX `_TacticToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tactic` ADD CONSTRAINT `Tactic_titleCategory_fkey` FOREIGN KEY (`titleCategory`) REFERENCES `Category`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChessGame` ADD CONSTRAINT `ChessGame_playerWhiteId_fkey` FOREIGN KEY (`playerWhiteId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChessGame` ADD CONSTRAINT `ChessGame_playerBlackId_fkey` FOREIGN KEY (`playerBlackId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Friends` ADD CONSTRAINT `_Friends_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Friends` ADD CONSTRAINT `_Friends_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TacticToUser` ADD CONSTRAINT `_TacticToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Tactic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TacticToUser` ADD CONSTRAINT `_TacticToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
