import * as Helpers from '@secret-agent/testing/helpers';
import { inspect } from 'util';
import Puppet from '@secret-agent/puppet';
import { GlobalPool } from '@secret-agent/core';
import BrowserEmulators from '@secret-agent/core/lib/BrowserEmulators';
import injectedSourceUrl from '@secret-agent/core-interfaces/injectedSourceUrl';
import Log from '@secret-agent/commons/Logger';
import inspectHierarchy from './inspectHierarchy';
// @ts-ignore
// eslint-disable-next-line import/extensions
import { proxyFunction } from '../injected-scripts/_proxyUtils';
import { getOverrideScript } from '../lib/DomOverridesBuilder';

const { log } = Log(module);

let puppet: Puppet;
beforeAll(async () => {
  const engine = BrowserEmulators.getClass(GlobalPool.defaultBrowserEmulatorId).engine;
  puppet = new Puppet(engine);
  Helpers.onClose(() => puppet.close(), true);
  puppet.start();
});

afterAll(Helpers.afterAll);
afterEach(Helpers.afterEach);

const debug = process.env.DEBUG || false;

test('should be able to override a function', async () => {
  class TestClass {
    public doSomeWork(param: string) {
      return `${param} nope`;
    }
  }
  const holder = {
    tester: new TestClass(),
  };
  const win = {
    TestClass,
    holder,
  };

  const hierarchy = JSON.parse(await inspectHierarchy(win, 'win')).window;
  if (debug) console.log(inspect(hierarchy, false, null, true));
  expect(win.holder.tester.doSomeWork('we')).toBe('we nope');

  proxyFunction(win.TestClass.prototype, 'doSomeWork', (target, thisArg, args) => {
    return `${target.apply(thisArg, args)} yep`;
  });

  const afterHierarchy = JSON.parse(await inspectHierarchy(win, 'win')).window;
  if (debug) console.log(inspect(afterHierarchy, false, null, true));

  expect(win.holder.tester.doSomeWork('oh')).toBe('oh nope yep');
  expect(afterHierarchy.TestClass.prototype.doSomeWork._$invocation).toBe('undefined nope yep');
  // these 2 will now be different in the structure
  delete hierarchy.TestClass.prototype.doSomeWork._$invocation;
  delete afterHierarchy.TestClass.prototype.doSomeWork._$invocation;
  expect(hierarchy).toStrictEqual(afterHierarchy);
});

test('should override a function and clean error stacks', async () => {
  const httpServer = await Helpers.runHttpServer();

  const context = await puppet.newContext(
    {
      proxyPassword: '',
      platform: 'win32',
      locale: 'en',
      userAgent: 'Plugin Test',
      viewport: {
        screenHeight: 900,
        screenWidth: 1024,
        positionY: 0,
        positionX: 0,
        height: 900,
        width: 1024,
      },
    },
    log,
  );
  Helpers.onClose(() => context.close());
  const page = await context.newPage();

  page.on('page-error', console.log);
  if (debug) {
    page.on('console', console.log);
  }
  await page.addNewDocumentScript(
    getOverrideScript('navigator.deviceMemory', {
      memory: '4gb',
    }).script,
    false,
  );
  await Promise.all([
    page.navigate(httpServer.url),
    page.waitOn('frame-lifecycle', ev => ev.name === 'DOMContentLoaded'),
  ]);

  const worksOnce = await page.evaluate(
    `navigator.permissions.query({ name: 'geolocation' }).then(x => x.state)`,
  );
  expect(worksOnce).toBeTruthy();

  const perms = await page.evaluate(`(async () => {
    try {
      await navigator.permissions.query()
    } catch(err) {
      return err.stack;
    }
  })();`);
  expect(perms).not.toContain(injectedSourceUrl);
});

test('should override Errors properly on https pages', async () => {
  const httpServer = await Helpers.runHttpsServer((req, res) => {
    res.end(`<html lang="en"><body><h1>Hi</h1></body></html>`);
  });

  const context = await puppet.newContext(
    {
      proxyPassword: '',
      platform: 'win32',
      locale: 'en',
      userAgent: 'Plugin Test',
      viewport: {
        screenHeight: 900,
        screenWidth: 1024,
        positionY: 0,
        positionX: 0,
        height: 900,
        width: 1024,
      },
    },
    log,
  );
  Helpers.onClose(() => context.close());
  const page = await context.newPage();

  page.on('console', console.log);
  await page.addNewDocumentScript(getOverrideScript('Error.captureStackTrace').script, false);
  await page.addNewDocumentScript(getOverrideScript('Error.constructor').script, false);
  await Promise.all([page.navigate(httpServer.url), page.waitOn('load')]);

  const errorToString = await page.evaluate(`Error.toString()`);
  expect(errorToString).toBe('function Error() { [native code] }');
  const errorToStringString = await page.evaluate(`Error.toString.toString()`);
  expect(errorToStringString).toBe('function toString() { [native code] }');
  const errorConstructorToString = await page.evaluate(`Error.constructor.toString()`);
  expect(errorConstructorToString).toBe('function Function() { [native code] }');
});
