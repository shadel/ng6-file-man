import {NodeInterface} from '../interfaces/node.interface';
import {ConfigInterface} from '../interfaces/config.interface';

export class TreeModel {
  private _currentPath: string;
  private _nodes: NodeInterface;
  private _selectedNodeId: string;
  public config: NodeInterface;

  constructor(config: NodeInterface) {
    this._currentPath = config.startingFolder;
    this.config = config;

    this.nodes = <NodeInterface>{
      id: 'root',
      pathToNode: 'root',
      isFolder: true,
      isExpanded: true,
      stayOpen: true,
      name: 'root',
      children: {}
    };
  }

  public foldNode(node: NodeInterface) {
    if (!node.stayOpen) {
      node.isExpanded = false;
    }
  }

  public foldNodeRecursively(node: NodeInterface) {
    this.foldNode(node);

    console.log(node);

    for (const childNode in node.children) {
      if (node.children.hasOwnProperty(childNode)) {
        this.foldNodeRecursively(node.children[childNode]);
      }
    }
  }

  get currentPath(): string {
    return this._currentPath;
  }

  set currentPath(value: string) {
    this._currentPath = value;
  }

  get nodes(): NodeInterface {
    return this._nodes;
  }

  set nodes(value: NodeInterface) {
    this._nodes = value;
  }

  get selectedNodeId(): string {
    return this._selectedNodeId;
  }

  set selectedNodeId(value: string) {
    this._selectedNodeId = value;
  }

  get isCache(): boolean {
    return this.config.isCache;
  }

  set isCache(value: boolean) {
    this.config.isCache = value;
  }
}