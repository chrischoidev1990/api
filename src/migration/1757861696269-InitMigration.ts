import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1757861696269 implements MigrationInterface {
    name = 'InitMigration1757861696269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(50) NOT NULL, \`phone\` varchar(20) NULL, \`profile_image_url\` varchar(2048) NULL, UNIQUE INDEX \`IDX_2714af51e3f7dd42cf66eeb08d\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_2714af51e3f7dd42cf66eeb08d\` ON \`members\``);
        await queryRunner.query(`DROP TABLE \`members\``);
    }

}
