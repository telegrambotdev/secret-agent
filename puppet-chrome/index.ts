import IPuppetBrowser from '@secret-agent/puppet-interfaces/IPuppetBrowser';
import ILaunchedProcess from '@secret-agent/puppet-interfaces/ILaunchedProcess';
import IPuppetLauncher from '@secret-agent/puppet-interfaces/IPuppetLauncher';
import os from 'os';
import Path from 'path';
import { Browser } from './lib/Browser';
import { Connection } from './lib/Connection';

let counter = 0;

const PuppetLauncher: IPuppetLauncher = {
  getLaunchArgs(options: { proxyPort?: number; showBrowser?: boolean }) {
    const chromeArguments = [...defaultArgs];
    if (!options.showBrowser) {
      chromeArguments.push(
        '--headless',
        '--hide-scrollbars',
        '--mute-audio',
        '--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4',
      );
    } else {
      chromeArguments.push(
        `--user-data-dir=${Path.join(os.tmpdir(), 'chromium-headed-data', String((counter += 1)))}`,
      );
      chromeArguments.push('--auto-open-devtools-for-tabs');
    }

    if (options.proxyPort !== undefined) {
      chromeArguments.push(`--proxy-server=localhost:${options.proxyPort}`);
    }

    if (process.env.NO_CHROME_SANDBOX) {
      chromeArguments.push('--no-sandbox');
    } else if (os.platform() === 'linux') {
      const runningAsRoot = process.geteuid && process.geteuid() === 0;
      if (runningAsRoot) {
        // eslint-disable-next-line no-console
        console.warn(
          'WARNING: Secret-Agent is being run under "root" user - disabling Chromium sandbox! ' +
            'Run under regular user to get rid of this warning.',
        );
        chromeArguments.push('--no-sandbox');
      }
    }
    return chromeArguments;
  },
  async createPuppet(process: ILaunchedProcess, revision: string): Promise<IPuppetBrowser> {
    const { transport, close } = process;
    try {
      const connection = new Connection(transport);
      return await Browser.create(connection, revision, close);
    } catch (error) {
      close();
      throw error;
    }
  },
};
export default PuppetLauncher;

const defaultArgs = [
  '--disable-background-networking',
  '--enable-features=NetworkService,NetworkServiceInProcess',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-extensions-with-background-pages',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-extensions',
  '--disable-features=TranslateUI,site-per-process',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-sync',
  '--disable-gpu',
  '--enable-logging',
  '--force-color-profile=srgb',
  '--use-gl=swiftshader-webgl',
  '--use-gl=swiftshader',
  '--use-gl=osmesa',

  '--incognito',

  '--metrics-recording-only',
  '--no-first-run',

  '--enable-automation',
  '--remote-debugging-pipe',

  '--password-store=basic',
  '--use-mock-keychain',
  '--ignore-certificate-errors',
  '--allow-running-insecure-content',

  '--lang=en-US,en;q=0.9',

  // don't leak private ip
  '--force-webrtc-ip-handling-policy=default_public_interface_only',
  // Use proxy for localhost URLs
  '--proxy-bypass-list=<-loopback>',
  '--no-startup-window',
];
