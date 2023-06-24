-- DropForeignKey
ALTER TABLE `token` DROP FOREIGN KEY `Token_userid_fkey`;

-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));

-- AlterTable
ALTER TABLE `user` ADD COLUMN `salt` VARCHAR(191) NULL,
    MODIFY `aud` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
