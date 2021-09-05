import { Knex } from 'knex';
import { FastifyInstance } from "fastify";
declare module 'fastify' {
    interface FastifyInstance {
        knex: Knex;
    }
}
export declare function fastifyKnex(fastify: FastifyInstance, options: Knex.Config | string, done: any): void;
declare const _default: import("fastify").FastifyPluginCallback<string | Knex.Config<any>, any>;
export default _default;
