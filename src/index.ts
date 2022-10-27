import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell
} from '@jupyterlab/application';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { Clipboard } from '@jupyterlab/apputils';
import { fileIcon } from '@jupyterlab/ui-components';

const extension: JupyterFrontEndPlugin<void> = {
  id: 'context-menu',
  autoStart: true,
  requires: [IFileBrowserFactory, IDocumentManager, ILabShell],
  activate: (
    app: JupyterFrontEnd,
    factory: IFileBrowserFactory,
    docManager: IDocumentManager,
    labShell: ILabShell
  ) => {
    app.commands.addCommand('filebrowser:copy-relative-path', {
      label: 'Copy Relative Path',
      caption: 'Copy path relative to the active notebook.',
      icon: fileIcon.bindprops({ stylesheet: 'menuItem' }),
      execute: () => {
        const widget = factory.tracker.currentWidget;
        if (!widget) {
          return;
        }
        const item = widget.selectedItems().next();
        if (!item) {
          return;
        }
        if (!labShell.currentWidget) {
          return;
        }

        console.debug('labShell.currentWidget:', labShell.currentWidget);
        const context = docManager.contextForWidget(labShell.currentWidget);
        if (!context) {
          return;
        }

        console.debug(`context.path: ${context.path}`);
        const relativePath = getRelativePath(item.path, context.path);

        Clipboard.copyToSystem(relativePath);
        console.debug(`Copied relative path to clipboard: ${relativePath}`);
      },
      isVisible: () =>
        !!factory.tracker.currentWidget &&
        !!factory.tracker.currentWidget.selectedItems().next() &&
        !!labShell.currentWidget &&
        !!docManager.contextForWidget(labShell.currentWidget)
    });
  }
};

const getRelativePath = (target: string, reference: string): string => {
  const xs = target.split('/');
  const ys = reference.split('/').slice(0, -1);
  const n = Math.min(xs.length, ys.length);
  let count = 0;
  for (let i = 0; i < n; i++) {
    if (xs[i] === ys[i]) {
      count++;
    } else {
      break;
    }
  }

  const numUps = ys.length - count;
  const zs = [...(Array(numUps).fill('..') as string[]), ...xs.slice(count)];
  return zs.join('/');
};

export default extension;
