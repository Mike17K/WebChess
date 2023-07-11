-- AlterTable
ALTER TABLE `chessgame` ADD COLUMN `visibility` ENUM('public', 'private', 'friends') NOT NULL DEFAULT 'public';

-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));
