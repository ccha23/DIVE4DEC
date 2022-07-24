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

// Codemirror
import {EditorView, basicSetup} from "codemirror"
// import {EditorView} from "codemirror"
// import {editorSetup} from "./editorsetup"

// import {keymap} from "@codemirror/view"
import {javascript} from "@codemirror/lang-javascript"


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
  private editorContainer: HTMLDivElement;
  private outputContainer: HTMLIFrameElement;
  private outputDocument: Document;
  private codeScript: HTMLScriptElement;
  private controlContainer: HTMLDivElement;
  private showBtn: HTMLButtonElement;
  private runBtn: HTMLButtonElement;
  private mathjaxURL: string;
  private editorView: EditorView;

  render() {
    this.editorContainer = document.createElement('div');
    this.editorContainer.style.display = 'none';
    this.editorContainer.style.overflowX = 'auto';
    this.editorView = new EditorView({
      extensions: [basicSetup, 
      //   keymap.of([
      //   {
      //     key: "Ctrl-Enter", run: (() => {
      //       this.runCode()
      //       return true;
      //     }).bind(this)
      //   }
      // ]
      // ), 
      javascript()],
      parent: this.editorContainer,
    });
    this.editorView.dispatch({changes: {from: 0, insert: this.model.get('code')}});

    this.controlContainer = document.createElement('div');
    this.controlContainer.style.display = 'flex';
    this.showBtn = document.createElement('button');
    this.showBtn.innerText = 'show code';
    this.showBtn.onclick = this.toggleCode.bind(this);
    this.runBtn = document.createElement('button');
    this.runBtn.innerText = 'run code';
    this.runBtn.onclick = this.runCode.bind(this);
    this.runBtn.style.display = 'none';

    this.controlContainer.appendChild(this.showBtn);
    this.controlContainer.appendChild(this.runBtn);

    this.outputContainer = document.createElement('iframe');
    this.outputContainer.style.border = 'none';
    this.outputContainer.width = this.model.get('width');
    this.outputContainer.style.maxWidth = "100%";
    this.outputContainer.height = this.model.get('height');
    this.outputContainer.style.resize = 'both';
    this.model.widget_manager.resolveUrl(this.model.get('mathjax_url')).then(
      url => {
        this.mathjaxURL = url;
        this._setOutput();
      }
    );

    this.el.appendChild(this.outputContainer);
    this.el.appendChild(this.controlContainer);
    this.el.appendChild(this.editorContainer);

    this.outputContainer.onload = (function (this: JSXGraphView) {
      this.outputDocument = this.outputContainer.contentDocument!;
      this.codeScript = this.outputDocument!.createElement('script');
      this.outputDocument.body.appendChild(this.codeScript);
      this.setCode();
      this.model.on('change:code', this.setCode, this);
    }).bind(this);
  }

  /*
  Update the script element in the output container with the model code.
  */
  private setCode() {
    let script = this.outputDocument.createElement('script');
    script.innerHTML = this.model.get('code');
    this.outputDocument.body.replaceChild(script, this.codeScript);
    this.codeScript = script;
  }

  private _setOutput() {
    this.outputContainer.srcdoc = `<!DOCTYPE html>
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
    </body>
    </html>`;
  }

  private toggleCode() {
    if (this.editorContainer.style.display == 'block') {
      this.showBtn.innerText = 'show code';
      this.editorContainer.style.display = 'none';
      this.runBtn.style.display = 'none';
    } else {
      this.showBtn.innerText = 'hide code';
      this.editorContainer.style.display = 'block';
      this.runBtn.style.display = 'block';
    }
  }

  private runCode() {
    const code = this.editorView.state.doc.toString();
    this.model.set('code', code);
    this.model.save_changes();
  }
}