-- DropForeignKey
ALTER TABLE `token` DROP FOREIGN KEY `Token_userid_fkey`;

-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
