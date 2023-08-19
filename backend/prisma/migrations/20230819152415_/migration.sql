-- AlterTable
ALTER TABLE `Tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));

-- AlterTable
ALTER TABLE `Token` ADD COLUMN `type` ENUM('ACCESS', 'REFRESH') NOT NULL DEFAULT 'ACCESS';
