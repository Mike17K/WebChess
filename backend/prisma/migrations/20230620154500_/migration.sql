-- AlterTable
ALTER TABLE `tactic` MODIFY `endpoint` VARCHAR(191) NOT NULL DEFAULT (concat('/api/tactic/id/', id));

-- CreateTable
CREATE TABLE `Tocken` (
    `id` VARCHAR(191) NOT NULL,
    `tocken` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expired` DATETIME(3) NOT NULL,
    `userid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tocken` ADD CONSTRAINT `Tocken_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
