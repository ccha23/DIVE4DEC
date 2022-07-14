// Copyright (c) Chung Chan
// Distributed under the terms of the Modified BSD License.

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';


export class JSXGraphModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'JSXGraphModel',
      _view_name: 'JSXGraphView',
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,
      id: 'box'
    }
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };
}

export class JSXGraphView extends DOMWidgetView {
  private _JSXGraphInput: HTMLTextAreaElement;
  private _JSXGraphOutput: HTMLIFrameElement;
  private _JSXGraphInputControl: HTMLDivElement;
  private _JSXGraphShowButton: HTMLButtonElement;
  private mathjaxURL: string;

  render() {
    this._JSXGraphInput = document.createElement('textarea');
    this._JSXGraphInput.cols = 79;
    this._JSXGraphInput.rows = 5;
    this._JSXGraphInput.value = this.model.get('code');
    this._JSXGraphInput.style.display = 'none';
    this._JSXGraphInput.onchange = this._inputChanged.bind(this);

    this._JSXGraphInputControl = document.createElement('div');
    this._JSXGraphShowButton = document.createElement('button');
    this._JSXGraphShowButton.innerText = 'show code';
    this._JSXGraphShowButton.onclick = this._toggleShowButton.bind(this);
    this._JSXGraphInputControl.appendChild(this._JSXGraphShowButton);

    this._JSXGraphOutput = document.createElement('iframe');
    this._JSXGraphOutput.style.border = 'none';
    this._JSXGraphOutput.width = this.model.get('width');
    this._JSXGraphOutput.height = this.model.get('height');
    this._JSXGraphOutput.style.resize = 'both';
    this.model.widget_manager.resolveUrl(this.model.get('mathjax_url')).then(
      url => {
        this.mathjaxURL = url;
        this._setOutput();
      }
    );


    this.el.appendChild(this._JSXGraphOutput);
    this.el.appendChild(this._JSXGraphInputControl);
    this.el.appendChild(this._JSXGraphInput);
    this.model.on('change:code', this._setInput, this);
    this.model.on('change:code', this._setOutput, this);
  }

  private _setOutput() {
    this._JSXGraphOutput.srcdoc = `<!DOCTYPE html>
    <html>
      <head>
        <style>
        html, body {
          height: 100%;
        }
        body {
          display: flex;
          padding: 0;
          margin: 0;
        }
        .jxgbox {
          width:100%; 
          flex-grow: 1;
        }
        </style>
        <link rel="stylesheet" type="text/css" href="https://jsxgraph.org/distrib/jsxgraph.css" />
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js"></script>
        <script type="text/javascript" src="${this.mathjaxURL}"></script>
      </head>
    <body>
    <div id="${this.model.get('id')}" class="jxgbox"></div>
    <script type="text/javascript">
    ${this.model.get('code')}
    </script>
    </body>
    </html>`;
  }

  private _setInput() {
    this._JSXGraphInput.value = this.model.get('code');
  }

  private _inputChanged() {
    const code = this._JSXGraphInput.value;
    this.model.set('code', code);
    this.model.save_changes();
  }

  private _toggleShowButton() {
    if (this._JSXGraphInput.style.display=='block') {
      this._JSXGraphShowButton.innerText = 'show code';
      this._JSXGraphInput.style.display = 'none';
    } else {
      this._JSXGraphShowButton.innerText = 'hide code';
      this._JSXGraphInput.style.display = 'block';
    }
  }
}