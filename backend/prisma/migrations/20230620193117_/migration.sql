-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));

-- AlterTable
ALTER TABLE `user` ADD COLUMN `authProvider` VARCHAR(191) NULL;
