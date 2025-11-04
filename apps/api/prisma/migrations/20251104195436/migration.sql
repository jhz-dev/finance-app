-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `goalId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_goalId_fkey` FOREIGN KEY (`goalId`) REFERENCES `FinancialGoal`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
