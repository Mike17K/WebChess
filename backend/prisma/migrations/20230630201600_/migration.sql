/*
  Warnings:

  - Changed the type of `blackPlayerTime` on the `chessgame` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `whitePlayerTime` on the `chessgame` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `chessgame` DROP COLUMN `blackPlayerTime`,
    ADD COLUMN `blackPlayerTime` INTEGER NOT NULL,
    DROP COLUMN `whitePlayerTime`,
    ADD COLUMN `whitePlayerTime` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));
