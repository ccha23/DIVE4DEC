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
import {EditorView, keymap} from "@codemirror/view"
import {editorSetup} from "./editorsetup"
import {editorTheme} from "./editortheme"

import {EditorState} from "@codemirror/state"
import {javascript} from "@codemirror/lang-javascript"
import {html} from "@codemirror/lang-html"


export class DIVEWidgetModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'DIVEWidgetModel',
      _view_name: 'DIVEWidgetView',
      _model_module: MODULE_NAME,
      _model_module_version: MODULE_VERSION,
      _view_module: MODULE_NAME,
      _view_module_version: MODULE_VERSION,
      js: '// some code here',
      html: '<!-- some code here -->',
      height: 600,
      width: 600
    }
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };
}

export class DIVEWidgetView extends DOMWidgetView {
  private widgetContainer: HTMLDivElement;
  private tabContainer: HTMLDivElement;
  private jsTab: HTMLDivElement;
  private htmlTab: HTMLDivElement;
  private editorContainer: HTMLDivElement;
  private jsContainer: HTMLDivElement;
  private htmlContainer: HTMLDivElement;
  private outputContainer: HTMLIFrameElement;
  private outputDocument: Document;
  private jsScript: HTMLScriptElement;
  private controlContainer: HTMLDivElement;
  private showBtn: HTMLButtonElement;
  private runBtn: HTMLButtonElement;
  // private mathjaxURL: string;
  private jsView: EditorView;
  private htmlView: EditorView;

  render() {
    const runKeys = keymap.of([
      {
          key: "Ctrl-Enter", run: (() => {
            this.run()
            return true;
          }).bind(this)
      }
    ]);

    this.jsTab = document.createElement('div');
    this.htmlTab = document.createElement('div');
    this.jsTab.innerHTML = "JS";
    this.htmlTab.innerHTML = "HTML";
    this.jsTab.classList.add("active-tab");
    this.tabContainer = document.createElement('div');
    this.tabContainer.className = "tab-container";
    this.jsTab.onclick = (() => {
      this.htmlTab.classList.remove("active-tab");
      this.jsTab.classList.add("active-tab");
      this.htmlContainer.style.display = "none";
      this.jsContainer.style.display = "block";
    }).bind(this);
    this.htmlTab.onclick = (() => {
      this.htmlTab.classList.add("active-tab");
      this.jsTab.classList.remove("active-tab");
      this.htmlContainer.style.display = "block";
      this.jsContainer.style.display = "none";
    }).bind(this);
    this.tabContainer.appendChild(this.jsTab);
    this.tabContainer.appendChild(this.htmlTab);    

    this.jsContainer = document.createElement('div');
    this.jsContainer.className = "js-container";
    this.jsContainer.style.display = 'block';

    this.jsView = new EditorView({
      state: EditorState.create({
        doc: "",
        extensions: [editorTheme, editorSetup, runKeys, javascript()]
      }),
      parent: this.jsContainer
    });
    this.jsView.dispatch({changes: {from: 0, insert: this.model.get('js')}});

    this.htmlContainer = document.createElement('div');
    this.htmlContainer.className = "html-container";
    this.htmlContainer.style.display = 'none';

    this.htmlView = new EditorView({
      state: EditorState.create({
        doc: "",
        extensions: [editorSetup, runKeys, html()]
      }),
      parent: this.htmlContainer
    });
    this.htmlView.dispatch({changes: {from: 0, insert: this.model.get('html')}});

    this.editorContainer = document.createElement('div');
    this.editorContainer.style.display = 'none';
    this.editorContainer.className = 'editor-container';
    this.editorContainer.appendChild(this.jsContainer);
    this.editorContainer.appendChild(this.htmlContainer);
    

    this.controlContainer = document.createElement('div');
    this.controlContainer.className = 'control-container';
    this.controlContainer.style.display = 'flex';
    this.showBtn = document.createElement('button');
    this.showBtn.innerText = 'show code';
    this.showBtn.onclick = this.toggleCode.bind(this);
    this.runBtn = document.createElement('button');
    this.runBtn.innerText = 'run code';
    this.runBtn.title = 'Ctrl-Enter';
    this.runBtn.onclick = this.run.bind(this);
    this.runBtn.style.display = 'none';

    this.controlContainer.appendChild(this.showBtn);
    this.controlContainer.appendChild(this.runBtn);

    this.outputContainer = document.createElement('iframe');
    this.outputContainer.className = "output-container";
    this.outputContainer.width = this.model.get('width');
    this.outputContainer.height = this.model.get('height');

    this.setHtml();

    this.widgetContainer = document.createElement('div');
    this.widgetContainer.className = "divewidget";
    this.widgetContainer.appendChild(this.outputContainer);
    this.widgetContainer.appendChild(this.controlContainer);
    this.widgetContainer.appendChild(this.tabContainer);
    this.widgetContainer.appendChild(this.editorContainer);
    this.el.appendChild(this.widgetContainer);
  }

  private run() {
    const html = this.htmlView.state.doc.toString();
    const js = this.jsView.state.doc.toString();
    this.model.set('html', html);
    this.model.set('js', js);
    this.model.save_changes();
  }

  /*
  Update the html in the output container with the model html.
  */
  private setHtml() {
    this.outputContainer.srcdoc = this.model.get('html');

    this.outputContainer.onload = (function (this: DIVEWidgetView) {
      this.outputDocument = this.outputContainer.contentDocument!;
      this.jsScript = this.outputDocument!.createElement('script');
      this.outputDocument.body.appendChild(this.jsScript);
      this.setJs();
      this.model.on('change:js', this.setJs, this);
      this.model.on('change:html', this.setHtml, this);
    }).bind(this);
  }

  /*
  Update the script element in the output container with the model js.
  */
  private setJs() {
    let script = this.outputDocument.createElement('script');
    script.innerHTML = `(function () {
      ${this.model.get('js')}
    })();`;
    this.outputDocument.body.replaceChild(script, this.jsScript);
    this.jsScript = script;
  }

  private toggleCode() {
    if (this.editorContainer.style.display == 'block') {
      this.showBtn.innerText = 'show code';
      this.tabContainer.style.display = 'none';
      this.editorContainer.style.display = 'none';
      this.runBtn.style.display = 'none';
    } else {
      this.showBtn.innerText = 'hide code';
      this.tabContainer.style.display = 'flex';
      this.editorContainer.style.display = 'block';
      this.runBtn.style.display = 'block';
    }
  }

}