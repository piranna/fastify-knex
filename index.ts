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

  client.raw('SELECT VERSION()').then(onReady).catch(onError);
}

export default fp(fastifyKnex, {
  fastify: '>=3.x',
  name: 'fastify-knex',
});
