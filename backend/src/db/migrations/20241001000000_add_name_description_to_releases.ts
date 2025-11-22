import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("releases", (table) => {
        table.string("name").notNullable();
        table.text("description");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("releases", (table) => {
        table.dropColumn("name");
        table.dropColumn("description");
    });
}
