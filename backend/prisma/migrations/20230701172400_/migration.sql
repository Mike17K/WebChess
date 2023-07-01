-- AlterTable
ALTER TABLE `profile` ADD COLUMN `rating` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));
