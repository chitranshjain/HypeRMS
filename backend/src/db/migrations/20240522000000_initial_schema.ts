import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("products", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("name").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("releases", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("product_id").references("id").inTable("products").onDelete("CASCADE");
        table.date("target_date").notNullable();
        table.enum("status", ["PLANNED", "RELEASED"]).defaultTo("PLANNED");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("release_items", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("release_id").references("id").inTable("releases").onDelete("CASCADE");
        table.string("title").notNullable();
        table.text("description");
        table.enum("type", ["BUG_FIX", "FEATURE"]).notNullable();
        table.enum("status", ["DEV", "PRE_PROD", "RELEASED"]).defaultTo("DEV");
        table.string("jira_link");
        table.string("doc_link");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("prerequisites", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("release_item_id").references("id").inTable("release_items").onDelete("CASCADE");
        table.string("title").notNullable();
        table.enum("category", ["ENV_VAR", "MIGRATION", "INFRA", "PERMISSIONS"]).notNullable();
        table.enum("status", ["PENDING", "DONE"]).defaultTo("PENDING");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("prerequisites");
    await knex.schema.dropTableIfExists("release_items");
    await knex.schema.dropTableIfExists("releases");
    await knex.schema.dropTableIfExists("products");
}
