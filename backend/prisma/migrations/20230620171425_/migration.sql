/*
  Warnings:

  - The required column `aud` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));

-- AlterTable
ALTER TABLE `user` ADD COLUMN `aud` VARCHAR(191) NOT NULL,
    ADD COLUMN `picture` VARCHAR(191) NULL;
