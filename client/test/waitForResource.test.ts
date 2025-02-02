import IResourceMeta from '@secret-agent/core-interfaces/IResourceMeta';
import { Helpers } from '@secret-agent/testing/index';
import ICoreRequestPayload from '@secret-agent/core-interfaces/ICoreRequestPayload';
import ICoreResponsePayload from '@secret-agent/core-interfaces/ICoreResponsePayload';
import { Handler } from '../index';
import CoreClientConnection from '../connections/CoreClientConnection';

let payloadHandler: (payload: ICoreRequestPayload) => ICoreResponsePayload = () => null;
const outgoing = jest.fn(
  async (payload: ICoreRequestPayload): Promise<ICoreResponsePayload> => {
    const { command } = payload;
    const response = payloadHandler(payload);
    if (response) return response;
    if (command === 'createSession') {
      return {
        data: { tabId: 'tab-id', sessionId: 'session-id', sessionsDataLocation: '' },
      };
    }
    if (command === 'addEventListener') {
      return {
        data: { listenerId: 1 },
      };
    }
  },
);
class Piper extends CoreClientConnection {
  async internalSendRequest(payload: ICoreRequestPayload): Promise<void> {
    const responsePayload = await outgoing(payload);
    const response = <ICoreResponsePayload>{
      responseId: payload.messageId,
      ...(responsePayload ?? {}),
    };
    this.onMessage(response);
  }
}

beforeAll(() => {});

afterEach(Helpers.afterEach);
afterAll(Helpers.afterAll);

describe('waitForResource', () => {
  it('should break after finding one resource', async () => {
    payloadHandler = ({ command }: ICoreRequestPayload): ICoreResponsePayload => {
      if (command === 'waitForResource') {
        return { data: [{ id: 1, url: '/test.js' } as IResourceMeta] };
      }
    };

    const handler = new Handler(new Piper());
    Helpers.needsClosing.push(handler);
    const agent = await handler.createAgent();
    const resources = await agent.waitForResource({ url: '/test.js' });
    expect(resources).toHaveLength(1);
    await agent.close();
    await handler.close();
  });

  it('should try more than once to get files', async () => {
    let attempts = 0;
    payloadHandler = ({ command }: ICoreRequestPayload): ICoreResponsePayload => {
      if (command === 'waitForResource') {
        attempts += 1;
        if (attempts === 3) {
          return { data: [{ id: 1, url: '/test2.js' } as IResourceMeta] };
        }
        return { data: [] };
      }
    };

    const handler = new Handler(new Piper());
    Helpers.needsClosing.push(handler);
    const agent = await handler.createAgent();
    const resources = await agent.waitForResource({ url: '/test2.js' });
    expect(resources).toHaveLength(1);
    expect(attempts).toBe(3);

    await agent.close();
    await handler.close();
  });

  it('should return multiple files if many match on one round trip', async () => {
    payloadHandler = ({ command }: ICoreRequestPayload): ICoreResponsePayload => {
      if (command === 'waitForResource') {
        return {
          data: [
            { id: 1, url: '/test3.js', type: 'Xhr' } as IResourceMeta,
            { id: 2, url: '/test4.js', type: 'Xhr' } as IResourceMeta,
          ],
        };
      }
    };

    const handler = new Handler(new Piper());
    Helpers.needsClosing.push(handler);
    const agent = await handler.createAgent();
    const resources = await agent.waitForResource({ type: 'Xhr' });
    expect(resources).toHaveLength(2);

    await agent.close();
    await handler.close();
  });

  it('should match multiple files by url', async () => {
    payloadHandler = ({ command }: ICoreRequestPayload): ICoreResponsePayload => {
      if (command === 'waitForResource') {
        return {
          data: [
            { id: 1, url: '/test3.js' } as IResourceMeta,
            { id: 2, url: '/test4.js' } as IResourceMeta,
          ],
        };
      }
    };

    const handler = new Handler(new Piper());
    Helpers.needsClosing.push(handler);
    const agent = await handler.createAgent();
    const resources = await agent.waitForResource({ url: '/test3.js' });
    expect(resources).toHaveLength(2);

    await agent.close();
    await handler.close();
  });

  it('should allow a user to specify a match function', async () => {
    payloadHandler = ({ command }: ICoreRequestPayload): ICoreResponsePayload => {
      if (command === 'waitForResource') {
        return {
          data: [
            { id: 1, url: '/test1.js' } as IResourceMeta,
            { id: 2, url: '/test2.js' } as IResourceMeta,
            { id: 3, url: '/test3.js' } as IResourceMeta,
            { id: 4, url: '/test4.js' } as IResourceMeta,
          ],
        };
      }
    };

    const handler = new Handler(new Piper());
    Helpers.needsClosing.push(handler);
    const agent = await handler.createAgent();
    const resources = await agent.waitForResource({
      filterFn(resource, done) {
        if (resource.url === '/test1.js') {
          done();
          return true;
        }
      },
    });
    expect(resources).toHaveLength(1);
    expect(resources[0].url).toBe('/test1.js');

    await agent.close();
    await handler.close();
  });

  it('should run multiple batches when a match function is provided', async () => {
    let counter = 0;
    payloadHandler = ({ command }: ICoreRequestPayload): ICoreResponsePayload => {
      if (command === 'waitForResource') {
        counter += 1;
        if (counter === 1) {
          return {
            data: [
              { id: 1, url: '/test1.js' } as IResourceMeta,
              { id: 2, url: '/test2.js' } as IResourceMeta,
              { id: 3, url: '/test3.js' } as IResourceMeta,
              { id: 4, url: '/test4.js' } as IResourceMeta,
            ],
          };
        }
        if (counter === 2 || counter === 3) {
          return { data: [] };
        }
        if (counter === 4) {
          return { data: [{ id: 5, url: '/test5.js' } as IResourceMeta] };
        }
      }
    };

    const handler = new Handler(new Piper());
    Helpers.needsClosing.push(handler);
    const agent = await handler.createAgent();
    const resources = await agent.waitForResource({
      filterFn(resource, done) {
        if (resource.url === '/test5.js') {
          done();
        }
        if (resource.url === '/test2.js') {
          return false;
        }
        return true;
      },
    });
    expect(resources).toHaveLength(4);

    await agent.close();
    await handler.close();
  });
});
