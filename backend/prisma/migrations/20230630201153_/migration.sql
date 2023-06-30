/*
  Warnings:

  - Added the required column `accessKey` to the `ChessGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blackPlayerTime` to the `ChessGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whitePlayerTime` to the `ChessGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chessgame` ADD COLUMN `accessKey` VARCHAR(191) NOT NULL,
    ADD COLUMN `blackPlayerTime` DATETIME(3) NOT NULL,
    ADD COLUMN `whitePlayerTime` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));
