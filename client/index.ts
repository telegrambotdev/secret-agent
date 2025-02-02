// setup must go first
import './lib/SetupAwaitedHandler';
import { BlockedResourceType } from '@secret-agent/core-interfaces/ITabOptions';
import { KeyboardKeys } from '@secret-agent/core-interfaces/IKeyboardLayoutUS';
import ResourceType from '@secret-agent/core-interfaces/ResourceType';
import { InteractionCommand, MouseButton } from '@secret-agent/core-interfaces/IInteractions';
import { Node, XPathResult } from '@secret-agent/core-interfaces/AwaitedDom';
import {
  LocationStatus,
  LocationTrigger,
  PipelineStatus,
} from '@secret-agent/core-interfaces/Location';
import IAgentCreateOptions from './interfaces/IAgentCreateOptions';
import ICoreConnectionOptions from './interfaces/ICoreConnectionOptions';
import Handler from './lib/Handler';
import Agent from './lib/Agent';
import RemoteCoreConnection from './connections/RemoteCoreConnection';
import LocalCoreConnection from './connections/LocalCoreConnection';

export default new Agent();

export {
  Handler,
  Agent,
  RemoteCoreConnection,
  LocalCoreConnection,
  InteractionCommand,
  MouseButton,
  ResourceType,
  KeyboardKeys,
  BlockedResourceType,
  IAgentCreateOptions,
  ICoreConnectionOptions,
  Node,
  XPathResult,
  LocationStatus,
  LocationTrigger,
  PipelineStatus,
};
