'use strict';

import fp from 'fastify-plugin';
import knex, { Knex } from 'knex';
import { FastifyInstance } from "fastify";

declare module 'fastify' {
  // @ts-ignore
  export interface FastifyInstance {
    knex: Knex;
  }
}

export function fastifyKnex(fastify: FastifyInstance, options: Knex.Config | string, done) {
  let client = knex(options);
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

  const versionFunc = (
    (options as Knex.Config).client as string
  ).includes('sqlite') ? 'sqlite_version' : 'VERSION';

  client.raw(`SELECT ${versionFunc}()`).then(onReady).catch(onError);
}

export default fp(fastifyKnex, {
  fastify: '>=3.x',
  name: 'fastify-knex',
});
