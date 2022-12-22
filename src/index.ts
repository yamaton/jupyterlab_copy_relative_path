import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILabShell,
} from '@jupyterlab/application';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { Clipboard } from '@jupyterlab/apputils';
import { fileIcon } from '@jupyterlab/ui-components';

import { getRelativePath } from './utils';
import { Widget } from '@lumino/widgets';
import { find } from '@lumino/algorithm';

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
    // For File Browser items
    app.commands.addCommand('filebrowser:copy-relative-path', {
      label: 'Copy Relative Path',
      caption: 'Copy path relative to the active document.',
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
        console.debug(`item.path: ${item.path}`);
        const relativePath = getRelativePath(item.path, context.path);
        console.debug(`Copied relative path to clipboard: ${relativePath}`);
        Clipboard.copyToSystem(relativePath);
      },
      isVisible: () =>
        !!factory.tracker.currentWidget &&
        !!factory.tracker.currentWidget.selectedItems().next() &&
        !!labShell.currentWidget &&
        !!docManager.contextForWidget(labShell.currentWidget),
    });


    // [NOTE] borrowed from jupyterlab/packages/application-extension/src/index.tsx
    const { shell } = app;
    const contextMenuWidget = (): Widget | null => {
      const test = (node: HTMLElement) => !!node.dataset.id;
      const node = app.contextMenuHitTest(test);

      if (!node) {
        // Fall back to active widget if path cannot be obtained from event.
        return shell.currentWidget;
      }

      return (
        find(shell.widgets('main'), widget => widget.id === node.dataset.id) ||
        shell.currentWidget
      );
    };

    // For tabs
    app.commands.addCommand('docmanager:copy-relative-path', {
      label: 'Copy Relative Path',
      caption: 'Copy path relative to the active document',
      icon: fileIcon.bindprops({ stylesheet: 'menuItem' }),
      execute: () => {
        const targetWidget = contextMenuWidget();
        if (!targetWidget) {
          return;
        }
        console.debug('widget:', targetWidget);

        const targetContext = docManager.contextForWidget(targetWidget);
        if (!targetContext) {
          return;
        }

        if (!labShell.currentWidget) {
          return;
        }

        console.debug('labShell.currentWidget:', labShell.currentWidget);
        const currentContext = docManager.contextForWidget(labShell.currentWidget);
        if (!currentContext) {
          return;
        }

        console.debug(`(current) context.path: ${currentContext.path}`);
        console.debug(`(target)  context.path: ${targetContext.path}`);
        const relativePath = getRelativePath(targetContext.path, currentContext.path);
        console.debug(`Copied relative path to clipboard: ${relativePath}`);
        Clipboard.copyToSystem(relativePath);
      },
      isVisible: () =>
        !!labShell.currentWidget &&
        !!docManager.contextForWidget(labShell.currentWidget),
    });

  },
};


export default extension;
