if (!process.env.NODE_ENV) {
  Reflect.set(process.env, 'NODE_ENV', 'test');
}
