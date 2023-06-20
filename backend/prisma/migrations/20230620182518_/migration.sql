/*
  Warnings:

  - You are about to drop the `tocken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tocken` DROP FOREIGN KEY `Tocken_userid_fkey`;

-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));

-- DropTable
DROP TABLE `tocken`;

-- CreateTable
CREATE TABLE `Token` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expired` DATETIME(3) NOT NULL,
    `userid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
