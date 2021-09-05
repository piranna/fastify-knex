'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastifyKnex = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const knex_1 = __importDefault(require("knex"));
function fastifyKnex(fastify, options, done) {
    let client = (0, knex_1.default)(options);
    fastify.decorate('knex', client);
    const onReady = function () {
        done();
    };
    const onError = function (err) {
        client.destroy(() => done(err));
    };
    fastify.addHook('onClose', (_, done) => {
        client.destroy(() => done());
    });
    client.raw('SELECT VERSION()').then(onReady).catch(onError);
}
exports.fastifyKnex = fastifyKnex;
exports.default = (0, fastify_plugin_1.default)(fastifyKnex, {
    fastify: '>=3.x',
    name: 'fastify-knex',
});
